import {
  OpenCanvasGraphAnnotation,
  OpenCanvasGraphReturnType,
} from "../../state";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import {
  getFormattedReflections,
  getModelFromConfig,
  getModelConfig,
  optionallyGetSystemPromptFromConfig,
} from "@/agent/utils";
import { ARTIFACT_TOOL_SCHEMA } from "./schemas";
import { ArtifactV3 } from "@/types";
import { createArtifactContent, formatNewArtifactPrompt } from "./utils";

/**
 * Generate a new artifact based on the user's query.
 */
export const generateArtifact = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig
): Promise<OpenCanvasGraphReturnType> => {
  // const { modelName } = getModelConfig(config);
  // const smallModel = await getModelFromConfig(config, {
  //   temperature: 0.5,
  // });
  //
  // const modelWithArtifactTool = smallModel.bindTools(
  //   [
  //     {
  //       name: "generate_artifact",
  //       schema: ARTIFACT_TOOL_SCHEMA,
  //     },
  //   ],
  //   { tool_choice: "generate_artifact" }
  // );
  //
  const memoriesAsString = await getFormattedReflections(config);
  // const formattedNewArtifactPrompt = formatNewArtifactPrompt(
  //   memoriesAsString,
  //   modelName
  // );
  //
  const userSystemPrompt = optionallyGetSystemPromptFromConfig(config);
  // const fullSystemPrompt = userSystemPrompt
  //   ? `${userSystemPrompt}\n${formattedNewArtifactPrompt}`
  //   : formattedNewArtifactPrompt;
  //
  // const response = await modelWithArtifactTool.invoke(
  //   [{ role: "system", content: fullSystemPrompt }, ...state.messages],
  //   { runName: "generate_artifact" }
  // );



  const newArtifact: ArtifactV3 = {
    currentIndex: 1,
    contents: [{
      index: 1,
      type: "text",
      title: "Title",
      fullMarkdown: "fullMarkdown fullMarkdown fullMarkdown fullMarkdown fullMarkdown fullMarkdown fullMarkdown fullMarkdown"
    }],
  };


  return {
    artifact: newArtifact
  };
};
