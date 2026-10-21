import fs from "fs";
import { getTelemetryMetrics, APP_LOG_PATH, ERROR_LOG_PATH } from "../utils/logger.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Controller to serve live telemetry metrics exclusively to Admin
 */
export const getTelemetryStats = async (req, res, next) => {
  try {
    const metrics = getTelemetryMetrics();
    return successResponse(res, 200, "Operational telemetry retrieved successfully.", metrics);
  } catch (err) {
    next(err);
  }
};

/**
 * Download raw app.log or error.log file (Admin Only)
 */
export const downloadAppLog = async (req, res, next) => {
  try {
    const type = req.query.type === "error" ? "error" : "app";
    const filePath = type === "error" ? ERROR_LOG_PATH : APP_LOG_PATH;

    if (!fs.existsSync(filePath)) {
      return errorResponse(res, 404, `Log file ${type}.log has not been generated yet.`);
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${type}.log"`);
    return res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};
