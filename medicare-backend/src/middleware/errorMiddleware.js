import { ZodError } from "zod";
import { errorResponse } from "../utils/response.js";
import { ENV } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  // Safe internal logging (excluding sensitive payloads)
  if (ENV.NODE_ENV !== "test") {
    console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message || err);
  }

  // 1. Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    res.locals.errorMessage = "Validation failed: " + formattedErrors.map(f => `${f.field}: ${f.message}`).join(", ");
    return errorResponse(res, 400, "Validation failed", formattedErrors);
  }

  // 2. JWT Malformed or Signature Errors
  if (err.name === "JsonWebTokenError") {
    res.locals.errorMessage = "Invalid token signature.";
    return errorResponse(res, 401, "Invalid token signature.");
  }

  // 3. Status Code & Safe Error Messaging
  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error occurred.";
  res.locals.errorMessage = message;

  // Mask internal 500 errors in production to prevent technical stack leakage (OWASP A05)
  if (statusCode === 500 && ENV.NODE_ENV === "production") {
    message = "An unexpected clinical system error occurred. Please try again or contact hospital support.";
  }

  return errorResponse(res, statusCode, message);
};
