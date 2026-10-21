import { errorResponse } from "../utils/response.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Forbidden: Role '${req.user ? req.user.role : "GUEST"}' is not authorized to access this clinical resource.`
      );
    }
    next();
  };
};
