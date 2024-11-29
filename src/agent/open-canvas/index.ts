import { END, LangGraphRunnableConfig, START, StateGraph } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation } from "./state";
import { generate  } from "@/agent/open-canvas/nodes/rag";
import { replyToGeneralInput } from "@/agent/open-canvas/nodes/rag/replyToGeneralInput";
import { generateArtifact, ragToolNode, ragTools } from "@/agent/open-canvas/nodes/rag/generateArtifact";
import { generateFollowup } from "@/agent/open-canvas/nodes/generateFollowup";
import { reflectNode } from "@/agent/open-canvas/nodes/reflect";
import { DEFAULT_INPUTS } from "@/constants";
import { generatePath } from "@/agent/open-canvas/nodes/rag/generatePath";
import { getModelConfig, getModelFromConfig } from "@/agent/utils";
import { AIMessage } from "@langchain/core/messages";
// import { ChatOpenAI } from "@langchain/openai";
// import { createRetrieverTool } from "langchain/dist/tools/retriever";


// const routeNode = (state: typeof OpenCanvasGraphAnnotation.State) => {
//   if (!state.next) {
//     throw new Error("'next' state field not set.");
//   }
//
//   return new Send(state.next, {
//     ...state,
//   });
// };
//
const cleanState = (_: typeof OpenCanvasGraphAnnotation.State,) => {
  return {
    ...DEFAULT_INPUTS,
  };
};

// /**
//  * Conditionally route to the "generateTitle" node if there are only
//  * two messages in the conversation. This node generates a concise title
//  * for the conversation which is displayed in the thread history.
//  */
// const conditionallyGenerateTitle = (
//   state: typeof OpenCanvasGraphAnnotation.State
// ) => {
//   if (state.messages.length > 2) {
//     // Do not generate if there are more than two messages (meaning it's not the first human-AI conversation)
//     return END;
//   }
//   return "generateTitle";
// };


// Define the function that calls the model
async function callModel(state: typeof OpenCanvasGraphAnnotation.State,
                         config: LangGraphRunnableConfig) {
  console.log(state)
  const smallModel = (await getModelFromConfig(config)).bindTools(ragTools);
  const messages = state.messages;
  const response = await smallModel.invoke(messages);
  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}


// Define the function that determines whether to continue or not
// We can extract the state typing via `StateAnnotation.State`
function shouldContinue(state: typeof OpenCanvasGraphAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  console.log(state)
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return END;
}

const builder = new StateGraph(OpenCanvasGraphAnnotation)
  .addNode("replyToGeneralInput", callModel)
  .addNode("tools", ragToolNode)
  .addEdge(START, "replyToGeneralInput")
  .addConditionalEdges("replyToGeneralInput", shouldContinue)
  .addEdge("tools", "replyToGeneralInput");


// const builder = new StateGraph(OpenCanvasGraphAnnotation)
//   .addNode("generatePath", callModel)
//   // .addNode("replyToGeneralInput", replyToGeneralInput) // Add agent node
//   .addNode("generateArtifact", ragToolNode) // Add grading node
//   .addEdge(START, "generatePath") // Start to agent node
//   .addEdge("generatePath", "generateArtifact")
//   .addNode("generateFollowup", generateFollowup)
//   .addNode("cleanState", cleanState)
//   // .addNode("reflect", reflectNode)
//   // .addEdge("replyToGeneralInput", "generateRagArtifact")
//   .addEdge("generateArtifact", "generateFollowup")
//   // .addConditionalEdges(
//   //   "replyToGeneralInput",
//   //   shouldRetrieve, // Conditional function to evaluate agent's decision
//   //   {
//   //     true: "gradeDocuments", // If condition is true
//   //     false: "generate", // If condition is false
//   //   }
//   // )
//   .addEdge("generateFollowup", "cleanState")
//   // .addEdge("reflect", "cleanState")
//   .addEdge("cleanState", END); // End the graph
//
// const builder = new StateGraph(OpenCanvasGraphAnnotation)
//   // Start node & edge
//   .addNode("generatePath", generatePath)
//   .addEdge(START, "generatePath")
//   // // Nodes
//   .addNode("replyToGeneralInput", replyToGeneralInput)
//   .addNode("rewriteArtifact", rewriteArtifact)
//   .addNode("rewriteArtifactTheme", rewriteArtifactTheme)
//   .addNode("rewriteCodeArtifactTheme", rewriteCodeArtifactTheme)
//   .addNode("updateArtifact", updateArtifact)
//   .addNode("updateHighlightedText", updateHighlightedText)
//   .addNode("generateArtifact", generateArtifact)
//   .addNode("customAction", customAction)
//   // .addNode("generateFollowup", generateFollowup)
//   .addNode("cleanState", cleanState)
//   // .addNode("reflect", reflectNode)
//   .addNode("generateTitle", generateTitleNode)
//   // // Initial router
//   .addConditionalEdges("generatePath", routeNode, [
//     "updateArtifact",
//     "rewriteArtifactTheme",
//     "rewriteCodeArtifactTheme",
//     "replyToGeneralInput",
//     "generateArtifact",
//     "rewriteArtifact",
//     "customAction",
//     "updateHighlightedText",
//   ])
//   // // Edges
//   .addEdge("generateArtifact", "generateFollowup")
//   .addEdge("updateArtifact", "generateFollowup")
//   .addEdge("updateHighlightedText", "generateFollowup")
//   .addEdge("rewriteArtifact", "generateFollowup")
//   .addEdge("rewriteArtifactTheme", "generateFollowup")
//   .addEdge("rewriteCodeArtifactTheme", "generateFollowup")
//   .addEdge("customAction", "generateFollowup")
//   // // End edges
//   .addEdge("replyToGeneralInput", "cleanState")
//   // // Only reflect if an artifact was generated/updated.
//   .addEdge("generateFollowup", "reflect")
//   .addEdge("reflect", "cleanState")
//  .addConditionalEdges("cleanState", conditionallyGenerateTitle, [
//     END,
//     "generateTitle",
//   ])
//   .addEdge("generateTitle", END);

export const graph = builder.compile().withConfig({ runName: "open_canvas" });
