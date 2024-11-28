import {
  OpenCanvasGraphAnnotation,
  OpenCanvasGraphReturnType,
} from "../../state";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import {
  optionallyGetSystemPromptFromConfig,
} from "@/agent/utils";
import { ArtifactV3 } from "@/types";
import { createArtifactContent } from "./utils";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";

/**
 * Generate a new artifact based on the user's query.
 */

// Define the tools for the agent to use

// Define the tools for the agent to use
const ragTool = tool(async ({ query }) => {
  // This is a placeholder for the actual implementation
  if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
    return "It's 60 degrees and foggy."
  }
  return "It's 90 degrees and sunny."
}, {
  name: "weather",
  description:
    "Call to get the current weather for a location.",
  schema: z.object({
    query: z.string().describe("The query to use in your search."),
  }),
});


export const ragTools = [ragTool];
export const ragToolNode = new ToolNode(ragTools);


export const generateArtifact = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig
): Promise<OpenCanvasGraphReturnType> => {


  const userSystemPrompt = optionallyGetSystemPromptFromConfig(config);
  const response = await ragToolNode.invoke([new HumanMessage(`${userSystemPrompt}`)])

  const newArtifactContent = createArtifactContent(response.tool_calls?.[0]);
  const newArtifact: ArtifactV3 = {
    currentIndex: 1,
    contents: [newArtifactContent],
  };

  return {
    artifact: newArtifact,
  };

};
