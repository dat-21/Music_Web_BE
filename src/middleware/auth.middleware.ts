import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.utils";
import { sendErrorResponse } from "../utils/respone.utils";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      sendErrorResponse(res, 401, "Authentication required");
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      sendErrorResponse(res, 403, "Invalid token");
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      sendErrorResponse(res, 403, "Token expired");
      return;
    }
    sendErrorResponse(res, 403, "Token verification failed");
  }
};

export const requireVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    sendErrorResponse(res, 401, "Authentication required");
    return;
  }

  if (!req.user.isVerified) {
    sendErrorResponse(res, 403, "Email not verified. Please check your inbox.");
    return;
  }

  next();
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendErrorResponse(res, 401, "Authentication required");
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendErrorResponse(res, 403, "Access denied. Insufficient permissions", {
        requiredRoles: allowedRoles,
        yourRole: req.user.role,
      });
      return;
    }
 
    next();
  };
};

export const isAdmin = authorize("admin");
export const isModerator = authorize("moderator");
export const isModeratorOrAdmin = authorize("admin", "moderator");

export const isOwnerOrAdmin = (resourceUserIdField: string = "userId") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendErrorResponse(res, 401, "Authentication required");
      return;
    }

    if (req.user.role === "admin") {
      next();
      return;
    }

    const resourceUserId =
      req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (req.user.id !== resourceUserId) {
      sendErrorResponse(res, 403, "You can only access your own resources");
      return;
    }

    next();
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch {
    next();
  }
};

export const verifyAuth = authenticate;