import { SerperJSONSchema } from "./types";

/**
 * Searches the web using the Serper Google Search API.
 * @param query - The search query string.
 * @param num - The number of results to return (default 5).
 * @returns An array of search result objects containing title and URL.
 * @throws Error if SERPER_API_KEY environment variable is not set.
 */
export async function searchSerper(query: string, num: number = 5) {
  const SERPER_API_KEY = process.env.SERPER_API_KEY;
  if (!SERPER_API_KEY) {
    throw new Error(
      "SERPER_API_KEY environment variable is required for web search."
    );
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: num,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API request failed: ${response.statusText}`);
    }

    const rawJSON = await response.json();
    const data = SerperJSONSchema.parse(rawJSON);

    return data.organic.map((result) => ({
      title: result.title,
      url: result.link,
    }));
  } catch (error) {
    console.error("Error during Serper search:", error);
    throw new Error(
      `Failed to execute Serper search: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Scrapes content from a given URL using the Jina AI Reader API (r.jina.ai).
 * It fetches the content by prefixing the URL with the Jina endpoint.
 * @param url - The URL of the webpage to scrape.
 * @returns The cleaned text content of the scraped page, or an empty string if scraping fails.
 */
export async function scrapeWithJina(url: string): Promise<string> {
  try {
    const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
    const scrapeResponse = await fetch(jinaUrl, {
      method: "GET",
      headers: { Accept: "application/json" }, // Request JSON for structured data if available
      // Consider adding a timeout
    });

    if (!scrapeResponse.ok) {
      // Log the status text for better debugging
      console.warn(
        `Jina AI scraping failed for ${url}: ${scrapeResponse.status} ${scrapeResponse.statusText}`
      );
      // Return empty string instead of throwing an error, allowing the process to continue
      return "";
    }

    // Try parsing as JSON first, fallback to text if it fails
    let scrapedData;
    try {
      scrapedData = await scrapeResponse.json();
    } catch (jsonError) {
      // If JSON parsing fails, try getting the text content
      scrapedData = await scrapeResponse.text();
    }

    if (
      !scrapedData ||
      (typeof scrapedData === "object" && Object.keys(scrapedData).length === 0)
    ) {
      console.warn(`No content scraped from ${url}`);
      return "";
    }

    // Convert to string if it's an object (JSON result)
    const contentString =
      typeof scrapedData === "string"
        ? scrapedData
        : JSON.stringify(scrapedData);

    return cleanedText(contentString);
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return ""; // Return empty string on error
  }
}

/**
 * Cleans up raw text content extracted from web scraping.
 * Removes excessive newlines, spaces, tabs, and limits the total length.
 * @param text - The raw text string to clean.
 * @returns The cleaned and truncated text string.
 */
function cleanedText(text: string): string {
  if (!text) return "";
  return text
    .trim()
    .replace(/(\r\n|\n|\r)/gm, " \n ") // Standardize newlines with spaces around them
    .replace(/\n+/g, "\n") // Collapse multiple newlines
    .replace(/\t+/g, " ") // Replace tabs with spaces
    .replace(/ +/g, " ") // Collapse multiple spaces
    .replace(/ {3,}/g, "  ") // Reduce very long spaces
    .substring(0, 20000); // Limit overall length
}
