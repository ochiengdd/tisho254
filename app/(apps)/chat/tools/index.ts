//hello
//export evertything here

// Re-export core types and schemas
export * from "./types";

// Import tool factory functions
import { createDocumentToolFactory } from "./createDocument";
import { updateDocumentToolFactory } from "./updateDocument";
import { suggestAppsToolFactory } from "./suggestApps";
import { browseInternetToolFactory } from "./browseInternet";

// Import shared types
import type { DataStreamWriter } from "ai";
import type {
  AllowedTools,
  ToolsReturn,
  BaseTools,
  BrowseTools,
} from "./types";

// Define tool categories (can be used for filtering)
export const canvasTools: AllowedTools[] = ["createDocument", "updateDocument"];
export const internetTools: AllowedTools[] = ["browseInternet"];
export const appTools: AllowedTools[] = ["suggestApps"];
export const allTools: AllowedTools[] = [
  ...canvasTools,
  ...internetTools,
  ...appTools,
];

/**
 * Master Factory Function for Creating AI Tools
 *
 * This function assembles the complete set of tools based on the provided context
 * and configuration (like whether browsing is enabled).
 * It uses the individual tool factory functions to create each tool definition,
 * injecting the necessary context (streamWriter, userId, modelId).
 *
 * @param streamWriter - Optional DataStreamWriter for UI updates.
 * @param userId - The ID of the user performing the action.
 * @param modelId - The ID of the AI model being used.
 * @param isBrowseEnabled - Flag indicating if the browseInternet tool should be included.
 * @returns A ToolsReturn object containing the configured tool definitions.
 */
export function createTools(
  streamWriter: DataStreamWriter | null,
  userId: string,
  modelId: string,
  isBrowseEnabled: boolean
): ToolsReturn {
  console.log("Creating tools with context:", {
    userId,
    modelId,
    isBrowseEnabled,
    hasStreamWriter: !!streamWriter,
  });

  // Create base tools using their factories, passing the context
  const baseTools: BaseTools = {
    createDocument: createDocumentToolFactory(streamWriter, userId, modelId),
    updateDocument: updateDocumentToolFactory(streamWriter, userId, modelId),
    suggestApps: suggestAppsToolFactory(streamWriter),
  };

  // If browsing is not enabled, return only the base tools
  if (!isBrowseEnabled) {
    return baseTools;
  }

  // If browsing is enabled, create the browse tool and add it
  const browseTools: BrowseTools = {
    browseInternet: browseInternetToolFactory(streamWriter),
  };

  // Combine base tools and browse tools
  return {
    ...baseTools,
    ...browseTools,
  };
}
