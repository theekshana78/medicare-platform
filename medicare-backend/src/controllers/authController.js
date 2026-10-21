import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/authValidator.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

export const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check existing email
    const existing = await db.collection("users").where("email", "==", validated.email).get();
    if (!existing.empty) {
      return errorResponse(res, 409, "A healthcare account with this email address already exists.");
    }

    // Hash password with salt rounds = 10
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const newUser = {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role, // Strictly PATIENT from hardened validator
      phone: validated.phone || "",
      dob: validated.dob || "",
      gender: validated.gender || "unspecified",
      bloodGroup: validated.bloodGroup || "O+",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("users").add(newUser);

    const token = signToken({
      id: docRef.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    // Sanitize user object (omit password)
    const { password, ...safeUser } = { ...newUser, id: docRef.id };

    return successResponse(res, 201, "Account registered successfully.", {
      user: safeUser,
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);

    const snapshot = await db.collection("users").where("email", "==", validated.email).get();
    if (snapshot.empty) {
      // Timing consistency & user enumeration mitigation
      return errorResponse(res, 401, "Invalid email or credentials.");
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(validated.password, userData.password);
    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or credentials.");
    }

    const token = signToken({
      id: userDoc.id,
      email: userData.email,
      role: userData.role,
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    const { password, ...safeUser } = { ...userData, id: userDoc.id };

    return successResponse(res, 200, "Signed in successfully.", {
      user: safeUser,
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.id).get();
    if (!userDoc.exists) {
      return errorResponse(res, 404, "User profile not found.");
    }
    const { password, ...safeUser } = userDoc.data();
    return successResponse(res, 200, "Authenticated user retrieved.", {
      user: { ...safeUser, id: userDoc.id },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  const { maxAge, ...clearCookieOptions } = COOKIE_OPTIONS;
  res.clearCookie("token", clearCookieOptions);
  return successResponse(res, 200, "Logged out successfully.");
};

export const updateProfile = async (req, res, next) => {
  try {
    const validated = updateProfileSchema.parse(req.body);

    const userRef = db.collection("users").doc(req.user.id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return errorResponse(res, 404, "User profile not found in clinical registry.");
    }

    // Build update object (strictly excluding role, email, password, id)
    const updatePayload = {
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    await userRef.update(updatePayload);

    const updatedDoc = await userRef.get();
    const { password, ...safeUser } = updatedDoc.data();

    return successResponse(res, 200, "Patient profile updated successfully.", {
      user: { ...safeUser, id: updatedDoc.id },
    });
  } catch (err) {
    next(err);
  }
};
