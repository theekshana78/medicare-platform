import { logRequest } from "../utils/logger.js";

/**
 * Enterprise HTTP Logging & Metrics Interceptor Middleware
 * Captures request duration, status code, IP, and logs to app.log and telemetry aggregator
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Capture client IP (handles reverse proxies & load balancers)
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    "-";

  // Intercept response finish event
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const role = req.user?.role || "guest";

    logRequest({
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration,
      ip: clientIp,
      role,
      error: res.locals?.errorMessage || null,
    });
  });

  next();
};
