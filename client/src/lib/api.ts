import { SearchResult } from "@/types";
import { apiRequest } from "@/lib/queryClient";

/**
 * Search files via the API
 */
export async function searchFiles(query: string): Promise<SearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`/api/search?search=${encodedQuery}`);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as SearchResult[];
  } catch (error) {
    console.error("Error searching files:", error);
    throw new Error("Failed to search for files. Please try again later.");
  }
}

/**
 * Fetch a direct download link
 */
export async function fetchDownloadLink(linkPart: string): Promise<string> {
  try {
    const fullUrl = `https://new3.scloud.ninja/dl/${linkPart}`;
    const response = await apiRequest("POST", "/api/download", { link: fullUrl });
    
    if (!response.ok) {
      throw new Error(`Failed to get download link: ${response.status} ${response.statusText}`);
    }
    
    const downloadLink = await response.text();
    return downloadLink;
  } catch (error) {
    console.error("Error fetching download link:", error);
    throw new Error("Failed to get download link. Please try again later.");
  }
}
