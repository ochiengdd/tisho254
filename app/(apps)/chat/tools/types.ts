import { z } from "zod";

// Defines the names of tools that are allowed to be used.
export type AllowedTools =
  | "createDocument"
  | "updateDocument"
  | "browseInternet"
  | "suggestApps";

// Schema for the response from the Serper API (Google Search).
export const SerperJSONSchema = z.object({
  organic: z.array(
    z.object({
      title: z.string().describe("The title of the search result."),
      link: z.string().describe("The URL of the search result."),
    })
  ),
});

// Schema for analyzing how well demo apps match user requirements.
export const AppAnalysisSchema = z.object({
  matches: z.array(
    z.object({
      id: z.string().describe("The short unique ID of the matched app."),
      relevanceScore: z
        .number()
        .min(0)
        .max(1)
        .describe(
          "A score from 0 to 1 indicating how relevant the app is to the query."
        ),
      reasoning: z
        .string()
        .describe(
          "Explanation of why this app matches the user's requirements."
        ),
      isStandaloneMatch: z
        .boolean()
        .describe(
          "Whether this app alone can fulfill the user's requirements."
        ),
      requiredCapabilities: z
        .array(z.string())
        .describe(
          "List of specific capabilities the user needs that this app provides."
        ),
    })
  ),
  needsCombination: z
    .boolean()
    .describe(
      "Indicates if multiple apps need to be combined to meet the requirements."
    ),
  summary: z
    .string()
    .describe("A brief summary of the analysis and recommendations."),
  recommendedWorkflow: z
    .string()
    .optional()
    .describe(
      "If combination is needed, a suggested workflow using multiple apps."
    ),
});

// Type definition for a single tool's structure.
export type ToolDefinition = {
  description: string;
  parameters: z.ZodObject<any>;
  execute: (params: any) => Promise<any>;
};

// Base set of tools always available.
export type BaseTools = {
  suggestApps: ToolDefinition;
  createDocument: ToolDefinition;
  updateDocument: ToolDefinition;
};

// Optional tools (e.g., requires specific flags or permissions).
export type BrowseTools = {
  browseInternet: ToolDefinition;
};

// The final structure of the tools object returned by createTools.
// It includes all base tools and potentially the browse tools.
export type ToolsReturn = BaseTools & Partial<BrowseTools>;
