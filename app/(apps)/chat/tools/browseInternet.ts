import { z } from "zod";
import { DataStreamWriter } from "ai";
import { generateUUID } from "@/lib/ai/chat";
import { searchSerper, scrapeWithJina } from "./helpers";
import { ToolDefinition } from "./types";

// Define the schema for the browseInternet tool parameters
const browseInternetSchema = z.object({
  query: z.string().describe("The search query to look up on the internet."),
});

// Type for the parameters expected by the execute function
type BrowseInternetParams = z.infer<typeof browseInternetSchema>;

/**
 * Factory function for the Internet Browsing Tool
 * Creates a ToolDefinition for searching the web and scraping results.
 *
 * @param streamWriter - Optional DataStreamWriter for UI updates (status messages).
 * @returns A ToolDefinition object for the browseInternet tool.
 */
export function browseInternetToolFactory(
  streamWriter: DataStreamWriter | null
  // Note: userId and modelId are not needed here but could be added if required
): ToolDefinition {
  return {
    description:
      "Search the internet for information about a specific topic or query.",
    parameters: browseInternetSchema,
    execute: async (params: BrowseInternetParams): Promise<any> => {
      const { query } = params;
      const toolCallId = generateUUID();
      console.log("Executing browseInternet tool with query:", query);

      try {
        // 1. Search using Serper
        if (streamWriter) {
          streamWriter.writeData({
            type: "status",
            content: `Searching the web for \"${query}\" ...`,
          });
        }
        const searchResults = await searchSerper(query, 5); // Get top 5 results

        if (!searchResults || searchResults.length === 0) {
          if (streamWriter) {
            streamWriter.writeData({
              type: "status",
              content: "No search results found.",
            });
          }
          return {
            toolCallId,
            sources: [],
            scrapedContent: [],
            message: "No search results found.",
          };
        }

        // 2. Scrape content with Jina AI Reader
        const scrapedContentPromises = [];
        if (streamWriter) {
          streamWriter.writeData({
            type: "status",
            content: `Found ${searchResults.length} relevant sources. Analyzing...`,
          });
        }

        // Initiate scraping for all sources concurrently
        for (const source of searchResults) {
          if (streamWriter) {
            // Optionally provide more granular status updates
            // streamWriter.writeData({ type: "status", content: `Scraping ${source.url}...` });
          }
          scrapedContentPromises.push(
            scrapeWithJina(source.url).then((content) => ({
              ...source,
              content,
            }))
          );
        }

        // Wait for all scraping attempts to complete
        const scrapedResults = await Promise.all(scrapedContentPromises);

        // Filter out results where scraping failed (content is empty)
        const successfulScrapes = scrapedResults.filter(
          (result) => result.content && result.content.trim() !== ""
        );

        if (streamWriter) {
          streamWriter.writeData({
            type: "status",
            content: `Analysis complete. ${successfulScrapes.length} sources successfully processed.`,
          });
        }

        // 3. Return structured data for the AI to process
        // Provide both the original source URLs/titles and the scraped content
        return {
          toolCallId,
          sources: searchResults.map((source) => ({
            title: source.title,
            url: source.url,
          })),
          scrapedContent: successfulScrapes.map((item) => ({
            title: item.title,
            url: item.url, // Include URL in scraped content for context
            content: item.content,
          })),
          message: `Successfully searched and processed ${successfulScrapes.length} sources.`, // Add a summary message
        };
      } catch (error) {
        console.error("Error in browseInternet tool execution:", error);
        if (streamWriter) {
          streamWriter.writeData({
            type: "error",
            content: "Internet search failed.",
          });
        }
        return {
          toolCallId,
          error: `Failed to complete internet search: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    },
  };
}
