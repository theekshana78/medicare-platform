import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust Logs Directory path (medicare-backend/logs)
const LOGS_DIR = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

export const APP_LOG_PATH = path.join(LOGS_DIR, "app.log");
export const ERROR_LOG_PATH = path.join(LOGS_DIR, "error.log");

// Ensure files exist on startup
if (!fs.existsSync(APP_LOG_PATH)) {
  fs.writeFileSync(APP_LOG_PATH, `[${new Date().toISOString()}] [INFO] MediCore Central Application Log Started\n`, "utf8");
}
if (!fs.existsSync(ERROR_LOG_PATH)) {
  fs.writeFileSync(ERROR_LOG_PATH, `[${new Date().toISOString()}] [INFO] MediCore Operational Error Log Started\n`, "utf8");
}

// In-Memory Telemetry Aggregation for real-time dashboard streaming
const endpointStats = new Map();
const errorsByEndpoint = new Map();
const statusCounts = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
const recentLogs = [];
const MAX_RECENT_LOGS = 100;

/**
 * Record and persist HTTP request and clinical error telemetry
 */
export const logRequest = ({ method, url, status, duration, ip = "-", role = "guest", error = null }) => {
  const timestamp = new Date().toISOString();
  const level = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO";

  // Normalize URL (strip query strings for clean endpoint grouping)
  const cleanUrl = url.split("?")[0] || "/";
  const routeKey = `${method} ${cleanUrl}`;

  // 1. Format Log Line
  const errorSnippet = error ? ` | Error: ${typeof error === "string" ? error : JSON.stringify(error)}` : "";
  const logLine = `[${timestamp}] [${level}] ${method} ${url} ${status} ${duration}ms - IP: ${ip} - Role: ${role}${errorSnippet}\n`;

  // 2. Append to logs/app.log
  fs.appendFile(APP_LOG_PATH, logLine, (err) => {
    if (err) console.error("Failed to write to app.log:", err.message);
  });

  // 3. If Error (4xx or 5xx), append to logs/error.log
  if (status >= 400) {
    fs.appendFile(ERROR_LOG_PATH, logLine, (err) => {
      if (err) console.error("Failed to write to error.log:", err.message);
    });
  }

  // 4. Update In-Memory Status Counts
  if (status >= 200 && status < 300) statusCounts["2xx"]++;
  else if (status >= 300 && status < 400) statusCounts["3xx"]++;
  else if (status >= 400 && status < 500) statusCounts["4xx"]++;
  else if (status >= 500) statusCounts["5xx"]++;

  // 5. Update Endpoint Statistics (Most called APIs)
  if (!endpointStats.has(routeKey)) {
    endpointStats.set(routeKey, {
      endpoint: cleanUrl,
      method,
      hits: 0,
      errors: 0,
      totalDuration: 0,
      avgDuration: 0,
      lastCalled: timestamp,
    });
  }
  const stat = endpointStats.get(routeKey);
  stat.hits += 1;
  stat.totalDuration += duration;
  stat.avgDuration = Math.round(stat.totalDuration / stat.hits);
  stat.lastCalled = timestamp;
  if (status >= 400) stat.errors += 1;

  // 6. Update Error Breakdown by Endpoint
  if (status >= 400) {
    if (!errorsByEndpoint.has(cleanUrl)) {
      errorsByEndpoint.set(cleanUrl, {
        endpoint: cleanUrl,
        method,
        count: 0,
        lastError: error || `HTTP ${status} response`,
        lastStatusCode: status,
        lastOccurred: timestamp,
      });
    }
    const errObj = errorsByEndpoint.get(cleanUrl);
    errObj.count += 1;
    errObj.lastError = error || `HTTP ${status} response`;
    errObj.lastStatusCode = status;
    errObj.lastOccurred = timestamp;
  }

  // 7. Push to Circular Log Buffer
  const logItem = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    level,
    method,
    url,
    status,
    duration,
    ip,
    role,
    error: error || (status >= 400 ? `HTTP ${status}` : null),
  };

  recentLogs.unshift(logItem);
  if (recentLogs.length > MAX_RECENT_LOGS) {
    recentLogs.pop();
  }
};

/**
 * Retrieve compiled telemetry metrics for the Administrator Console
 */
export const getTelemetryMetrics = () => {
  const topEndpoints = Array.from(endpointStats.values())
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 10);

  const errorBreakdown = Array.from(errorsByEndpoint.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalCalls = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const totalErrors = statusCounts["4xx"] + statusCounts["5xx"];
  const errorRatePercent = totalCalls > 0 ? ((totalErrors / totalCalls) * 100).toFixed(1) : "0.0";

  return {
    summary: {
      totalRequests: totalCalls,
      totalErrors,
      errorRate: `${errorRatePercent}%`,
      statusCounts,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
    },
    topEndpoints,
    errorBreakdown,
    recentLogs: recentLogs.slice(0, 50),
  };
};
