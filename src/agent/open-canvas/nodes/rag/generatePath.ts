import {
  CURRENT_ARTIFACT_PROMPT,
  NO_ARTIFACT_PROMPT,
  ROUTE_QUERY_OPTIONS_HAS_ARTIFACTS,
  ROUTE_QUERY_OPTIONS_NO_ARTIFACTS,
  ROUTE_QUERY_PROMPT,
} from "../prompts";
import { OpenCanvasGraphAnnotation } from "../state";
import { z } from "zod";
import { formatArtifactContentWithTemplate } from "../../utils";
import { getArtifactContent } from "../../../contexts/utils";
import { getModelFromConfig } from "../../utils";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { DEFAULT_INPUTS } from "@/constants";

/**
 * Routes to the proper node in the graph based on the user's query.
 */
export const generatePath = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig
) => {
  return {
    ...DEFAULT_INPUTS,
    next: "generateArtifact",
  };
};
