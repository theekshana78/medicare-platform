import admin from "firebase-admin";
import { verifyToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";
import { db } from "../config/db.js";

/**
 * Enterprise Authentication Middleware
 * Verifies Firebase Auth ID Token via firebase-admin SDK.
 * Fallback to cryptographic JWT verification for zero-config local environments.
 * Strictly binds authenticated identity to req.user (Never trusts client-supplied user IDs).
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Extract Bearer token from Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Extract from HttpOnly Cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 401, "Authentication token missing. Please sign in.");
    }

    let authenticatedUserId = null;
    let authenticatedEmail = null;
    let authenticatedRole = null;

    // 3. Verify via Firebase Admin SDK if active
    if (admin.apps && admin.apps.length > 0) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token, true); // checkRevoked = true
        authenticatedUserId = decodedToken.uid;
        authenticatedEmail = decodedToken.email;
        authenticatedRole = decodedToken.role;
      } catch (fbErr) {
        // Fallback to custom JWT if hybrid session
        try {
          const customDecoded = verifyToken(token);
          authenticatedUserId = customDecoded.id;
          authenticatedEmail = customDecoded.email;
          authenticatedRole = customDecoded.role;
        } catch {
          if (fbErr.code === "auth/id-token-expired") {
            return errorResponse(res, 401, "Session expired. Please sign in again.");
          }
          if (fbErr.code === "auth/id-token-revoked") {
            return errorResponse(res, 401, "Security token has been revoked. Re-authentication required.");
          }
          return errorResponse(res, 401, "Invalid Firebase authentication token.");
        }
      }
    } else {
      // 4. Custom JWT Verification
      const customDecoded = verifyToken(token);
      authenticatedUserId = customDecoded.id;
      authenticatedEmail = customDecoded.email;
      authenticatedRole = customDecoded.role;
    }

    if (!authenticatedUserId) {
      return errorResponse(res, 401, "Authentication failed: Unverified identity.");
    }

    // 5. Query user record in database to verify active state and authoritative role
    const userDoc = await db.collection("users").doc(authenticatedUserId).get();
    if (!userDoc.exists) {
      return errorResponse(res, 401, "The user belonging to this token no longer exists in the clinical registry.");
    }

    const userData = userDoc.data();

    // Attach verified user object to request (Server authoritative, tamper-proof)
    req.user = {
      id: userDoc.id,
      name: userData.name,
      email: userData.email || authenticatedEmail,
      role: userData.role || authenticatedRole,
      specialty: userData.specialty,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Session expired. Please sign in again.");
    }
    return errorResponse(res, 401, "Invalid authentication token.");
  }
};
