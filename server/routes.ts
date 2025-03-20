import type { Express } from "express";
import { createServer, type Server } from "http";
import * as cheerio from "cheerio";
import axios from "axios";
import * as tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

// Type definitions
export interface SearchResult {
  name: string;
  size: string;
  link: string;
  fileType?: string;
}

export interface DownloadResponse {
  url: string;
  filename: string;
  size: string;
  success: boolean;
}

export interface FileDetails {
  downloadUrl: string;
  filename: string;
  size: string;
}

// Create cookie jar for maintaining sessions
const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar }));

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for searching files
  app.get("/api/search", async (req, res) => {
    try {
      // Get search query from request
      const query = req.query.search as string;

      if (!query || query.trim() === "") {
        return res.status(400).json({
          error: "Search query is required",
          message: "Please provide a search term using the 'search' query parameter"
        });
      }

      const decodedQuery = decodeURIComponent(query);
      console.log(`GET /api/search with search="${decodedQuery}"`);

      // Fetch search results HTML
      const html = await fetchSearchResults(decodedQuery);

      // Parse HTML to extract file data
      const data = parseSearchResults(html);

      // Return JSON response with metadata
      return res.status(200).json({
        query: decodedQuery,
        count: data.length,
        results: data
      });
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      return res.status(500).json({
        error: "Failed to fetch search results",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // API route for getting download links
  app.post("/api/download", async (req, res) => {
    try {
      const { link } = req.body;

      if (!link) {
        return res.status(400).json({
          error: "Link is required",
          message: "Please provide a 'link' parameter in the request body"
        });
      }

      let fullUrl = link;
      let linkId = link;

      // Check if the link is just the ID part and construct the full URL
      if (!link.startsWith('http')) {
        fullUrl = `https://new3.scloud.ninja/dl/${link}`;
        linkId = link;
      } else {
        // Extract linkId from the URL if it's a full URL
        linkId = link.split('/').pop() || link;
      }

      console.log(`POST /api/download with link="${fullUrl}"`);
      const fileDetails = await fetchDownloadLink(fullUrl);

      if (!fileDetails.downloadUrl) {
        return res.status(404).json({
          error: "Download link not found",
          message: "Unable to extract download link from the provided URL"
        });
      }

      // Return JSON response with download information
      return res.status(200).json({
        url: fileDetails.downloadUrl,
        filename: fileDetails.filename,
        size: fileDetails.size,
        success: true
      });
    } catch (error) {
      console.error("Failed to fetch download link:", error);
      return res.status(500).json({
        error: "Failed to fetch download link",
        message: error instanceof Error ? error.message : "Unknown error",
        success: false
      });
    }
  });

  // Add an endpoint for download info
  app.get("/api/download/:linkId", async (req, res) => {
    try {
      const { linkId } = req.params;

      if (!linkId) {
        return res.status(400).json({
          error: "Link ID is required",
          message: "Please provide a linkId as part of the URL"
        });
      }

      const fullUrl = `https://new4.scloud.ninja/file/${linkId}`;
      console.log(`GET /api/download/${linkId}`);

      const fileDetails = await fetchDownloadLink(fullUrl);

      if (!fileDetails.downloadUrl) {
        return res.status(404).json({
          error: "Download link not found",
          message: "Unable to extract download link from the provided URL"
        });
      }

      // Return JSON response with download information
      return res.status(200).json({
        url: fileDetails.downloadUrl,
        filename: fileDetails.filename,
        size: fileDetails.size,
        success: true
      });
    } catch (error) {
      console.error(`Failed to fetch download link for ${req.params.linkId}:`, error);
      return res.status(500).json({
        error: "Failed to fetch download link",
        message: error instanceof Error ? error.message : "Unknown error",
        success: false
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

/**
 * Fetch search results from SCloud
 */
async function fetchSearchResults(searchQuery: string) {
  try {
    // Step 1: Get search token
    const tokenResponse = await fetch("https://new4.scloud.ninja/get-search-token", {
      method: "POST",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://new4.scloud.ninja",
        Referer: "https://new4.scloud.ninja/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Dest": "document",
      },
      body: new URLSearchParams({ search_query: searchQuery }).toString(),
      redirect: "manual", // Prevents auto-following redirects
    });

    const locationHeader = tokenResponse.headers.get("location");
    if (!locationHeader) throw new Error("Token not found in response");

    const tokenMatch = locationHeader.match(/token=([a-f0-9-]+)/);
    if (!tokenMatch) throw new Error("Failed to extract token");

    const token = tokenMatch[1];

    // Step 2: Fetch Search Results
    const finalResponse = await fetch(`https://new4.scloud.ninja/?token=${token}`, {
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
        Referer: "https://new4.scloud.ninja/",
      },
    });

    const html = await finalResponse.text();
    return html;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}

/**
 * Parse HTML search results and extract file data
 */
function parseSearchResults(html: string | undefined): SearchResult[] {
  if (!html) return [];

  const $ = cheerio.load(html);
  let results: SearchResult[] = [];

  $("a[href]").each((_: any, element: any) => {
    const title = $(element).find(".title-container span").text().trim();
    const size = $(element).find("span.inline-block").text().trim();
    const link = $(element).attr("href");
    const linkPart = link?.split("/").pop() ?? "";

    if (title && size && linkPart) {
      // Try to determine file type from the extension
      const fileType = getFileType(title);

      results.push({
        name: title,
        size,
        link: linkPart,
        fileType
      });
    }
  });

  return results;
}

/**
 * Fetch download link from a file page
 */
async function fetchDownloadLink(link: string): Promise<FileDetails> {
  try {
    // Fix the URL format - convert from dl to file endpoint
    let filePageUrl = link;
    if (link.includes('new3.scloud.ninja/dl/')) {
      const linkId = link.split('/').pop();
      filePageUrl = `https://new4.scloud.ninja/file/${linkId}`;
    }

    // Extract linkId for later use
    const linkId = filePageUrl.split('/').pop() || "";

    // First, try to get filename and size from search results
    // This is often more reliable than parsing the file page
    let filenameFromSearch = "";
    let sizeFromSearch = "";

    // Only do this if we have a linkId and it's from the file endpoint
    if (linkId && filePageUrl.includes('/file/')) {
      try {
        console.log(`Fetching search results for linkId: ${linkId}`);
        // Search for files with this linkId
        const searchUrl = `https://new4.scloud.ninja/s?q=${linkId}`;
        const searchResponse = await fetch(searchUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Referer: "https://new4.scloud.ninja/",
          }
        });

        const searchHtml = await searchResponse.text();
        const searchDom = cheerio.load(searchHtml);

        // Look for the file link in search results
        searchDom(`a[href*="${linkId}"]`).each((_, element) => {
          const title = searchDom(element).find(".title-container span").text().trim();
          const size = searchDom(element).find("span.inline-block").text().trim();

          if (title && size) {
            filenameFromSearch = title;
            sizeFromSearch = size;
            console.log(`Found in search results - Filename: ${filenameFromSearch}, Size: ${sizeFromSearch}`);
            return false; // break the loop
          }
        });
      } catch (searchError) {
        console.error("Error fetching search results:", searchError);
        // Continue with file page parsing
      }
    }

    console.log(`Fetching download link from: ${filePageUrl}`);
    const response = await fetch(filePageUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://new4.scloud.ninja/",
      },
    });

    const html = await response.text();

    // Log a snippet of the HTML to debug
    console.log(`HTML response (excerpt): ${html.substring(0, 300)}...`);

    // Parse HTML to find the direct download link and file details
    const $ = cheerio.load(html);

    // Primary selector for download link based on the provided code
    let downloadUrl = $("a.block").attr("href");

    // Try alternative selectors if the primary one fails
    if (!downloadUrl) {
      downloadUrl = $("a.button").attr("href");
    }

    if (!downloadUrl) {
      downloadUrl = $("a[download]").attr("href");
    }

    if (!downloadUrl) {
      // Look for any link that might be a download link
      $("a").each((_, element) => {
        const href = $(element).attr("href");
        const text = $(element).text().toLowerCase();
        if (href && (text.includes("download") || href.includes("download"))) {
          downloadUrl = href;
          return false; // break the loop
        }
      });
    }

    // Extract filename from the page title or heading
    let filename = $("p.break-all").text();

    

    // Extract file size
    let size = "";

    // First try to get size from search results if we have that info
    if (filePageUrl.includes('/file/')) {
      // Try to get the file size from the search results
      const linkId = filePageUrl.split('/').pop();
      const searchPage = await fetch(`https://new4.scloud.ninja/s?q=${encodeURIComponent(filename)}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        }
      });

      const searchHtml = await searchPage.text();
      const searchDom = cheerio.load(searchHtml);

      searchDom(`a[href*="${linkId}"]`).each((_, element) => {
        const sizeElement = searchDom(element).find("span.inline-block");
        if (sizeElement.length) {
          size = sizeElement.text().trim();
          return false; // break the loop
        }
      });
    }

    // If size not found in search results, try direct page elements
    if (!size) {
      $(".ml-2, .size-info, .file-info, .file-size, span.text-sm").each((_, element) => {
        const text = $(element).text().trim();
        if (text && (text.includes("MB") || text.includes("GB") || text.includes("KB"))) {
          size = text;
          return false; // break the loop
        }
      });
    }

    // If size still not found, try other methods
    if (!size) {
      // Look for text containing size patterns
      $("p, span, div").each((_, element) => {
        const text = $(element).text().trim();
        if (text && (text.includes("MB") || text.includes("GB") || text.includes("KB"))) {
          const sizeMatch = text.match(/[\d.]+ [KMG]B/);
          if (sizeMatch) {
            size = sizeMatch[0];
            return false; // break the loop
          }
        }
      });
    }

    // Fallback size if not found
    if (!size) {
      size = "Unknown size";
    }

    // Fallback filename if not found
    if (!filename || filename === "File Details") {
      // Check if we have original filename from search
      if (filePageUrl.includes('/file/')) {
        const linkId = filePageUrl.split('/').pop();

        // Try to look up the file in search results to get the proper name
        // This search is lightweight and only looks for files with matching linkId
        const searchPage = await fetch(`https://new4.scloud.ninja/?q=${linkId}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          }
        });

        const searchHtml = await searchPage.text();
        const searchDom = cheerio.load(searchHtml);

        searchDom(`a[href*="${linkId}"]`).each((_, element) => {
          const nameElement = searchDom(element).find(".title-container span");
          if (nameElement.length) {
            filename = nameElement.text().trim();
            return false; // break the loop
          }
        });
      }

      // If still not found, use link ID
      if (!filename || filename === "File Details") {
        const linkId = filePageUrl.split('/').pop();
        filename = linkId || "unknown-file";
      }
    }

    console.log(`Found download link: ${downloadUrl}`);
    console.log(`Filename: ${filename}, Size: ${size}`);

    // Use filename from search results if available
    if (filenameFromSearch) {
      filename = filenameFromSearch;
    }

    // Use size from search results if available
    if (sizeFromSearch) {
      size = sizeFromSearch;
    }

    // Return the download link and file details
    return {
      downloadUrl: downloadUrl || "",
      filename,
      size
    };
  } catch (error) {
    console.error("Error fetching download link:", error);
    throw error;
  }
}

/**
 * Determine file type based on file extension
 */
function getFileType(filename: string): string {
  const extension = getFileExtension(filename).toLowerCase();

  // Video files
  if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return 'video';
  }

  // Audio files
  if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(extension)) {
    return 'audio';
  }

  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
    return 'image';
  }

  // Document files
  if (['pdf'].includes(extension)) {
    return 'pdf';
  }

  if (['doc', 'docx'].includes(extension)) {
    return 'document';
  }

  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return 'spreadsheet';
  }

  if (['ppt', 'pptx'].includes(extension)) {
    return 'presentation';
  }

  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'archive';
  }

  // Subtitle files
  if (['srt', 'sub', 'sbv', 'vtt'].includes(extension)) {
    return 'subtitle';
  }

  // Code files
  if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'php', 'py', 'java', 'c', 'cpp', 'cs'].includes(extension)) {
    return 'code';
  }

  // Default type
  return 'other';
}

/**
 * Extract file extension from filename
 */
function getFileExtension(filename: string): string {
  // Check if the filename contains a dot
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';

  // Return the extension (everything after the last dot)
  return filename.substring(lastDotIndex + 1);
}