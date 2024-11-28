import { END, START, StateGraph } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation } from "./state";
import { generate  } from "@/agent/open-canvas/nodes/rag";
import { replyToGeneralInput } from "@/agent/open-canvas/nodes/rag/replyToGeneralInput";
import { generateArtifact } from "@/agent/open-canvas/nodes/rag/generateArtifact";
import { generateFollowup } from "@/agent/open-canvas/nodes/generateFollowup";
import { reflectNode } from "@/agent/open-canvas/nodes/reflect";
import { DEFAULT_INPUTS } from "@/constants";
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
const cleanState = (_: typeof OpenCanvasGraphAnnotation.State) => {
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



const builder = new StateGraph(OpenCanvasGraphAnnotation)
  // .addNode("replyToGeneralInput", replyToGeneralInput) // Add agent node
  .addNode("generateRagArtifact", generateArtifact) // Add grading node
  .addEdge(START, "generateRagArtifact") // Start to agent node
  .addNode("generateFollowup", generateFollowup)
  .addNode("cleanState", cleanState)
  .addNode("reflect", reflectNode)
  // .addEdge("replyToGeneralInput", "generateRagArtifact")
  .addEdge("generateRagArtifact", "generateFollowup")
  // .addConditionalEdges(
  //   "replyToGeneralInput",
  //   shouldRetrieve, // Conditional function to evaluate agent's decision
  //   {
  //     true: "gradeDocuments", // If condition is true
  //     false: "generate", // If condition is false
  //   }
  // )
  .addEdge("generateFollowup", "reflect")
  .addEdge("reflect", "cleanState")
  .addEdge("generateFollowup", END); // End the graph
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
