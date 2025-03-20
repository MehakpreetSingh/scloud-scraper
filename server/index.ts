import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

// Helper for logging
const log = (message: string, source = "express") => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS headers for API access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    log(logLine);
  });

  next();
});

// API documentation route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SCloud Search API",
    version: "1.0.0",
    endpoints: [
      {
        path: "/api/search",
        method: "GET",
        description: "Search for files",
        parameters: [
          { name: "search", type: "string", required: true, description: "Search query" }
        ]
      },

      {
        path: "/api/download",
        method: "POST",
        description: "Get download link for a file",
        parameters: [
          { name: "link", type: "string", required: true, description: "File link from search results" }
        ]
      },
      {
        path: "/api/download/:linkId",
        method: "GET",
        description: "Get download link for a file by ID",
        parameters: [
          { name: "linkId", type: "string", required: true, description: "File ID from search results" }
        ]
      }
    ]
  });
});

(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Server error:", err);
    res.status(status).json({ error: message });
  });

  // Not found middleware
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Start server
  const port = 3000;
  server.listen({
    port,
    host: "localhost",
  }, () => {
    log(`SCloud Search API server running on port ${port}`);
  });
})();
