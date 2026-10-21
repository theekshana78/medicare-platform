import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { requestLogger } from "./middleware/loggingMiddleware.js";

const app = express();

// 1. Strict Helmet Security Headers (OWASP A05)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: ["'self'", ENV.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    noSniff: true,
  })
);

// 2. Strict Whitelisted CORS (Prevent Origin Reflection / CSRF)
const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or whitelisted origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Access from specified origin denied."));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

// 3. Strict Payload Limit to prevent Request Flooding / DoS (OWASP A04)
app.use(express.json({ limit: "25kb" }));
app.use(cookieParser());

// Enterprise HTTP Telemetry & File Logger (OWASP A09)
app.use(requestLogger);

// 4. Rate Limiting Configurations (OWASP A04 & A07)
// General API Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many clinical requests. Please try again later." },
});
app.use("/api", generalLimiter);

// Strict Authentication Brute-Force Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Account locked for 15 minutes.",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// 5. Mount API Routes
app.use("/api", routes);

// 6. Centralized Error Handler (Prevent Information Disclosure)
app.use(errorHandler);

export default app;
