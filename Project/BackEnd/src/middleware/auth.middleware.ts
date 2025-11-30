// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken, TokenPayload } from "../utils/jwt";
// ✅ Extend Express Request type để thêm user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        role: string;
        isVerified: boolean;
      };
    }
  }
}

// ✅ Middleware xác thực đăng nhập (thay thế verifyAuth cũ)
// middleware/auth.middleware.ts (chỉ phần cần sửa)

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Token verification failed" });
  }
};

// ✅ Middleware yêu cầu email đã verify
export const requireVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({ 
      message: "Email not verified. Please check your inbox." 
    });
  }

  next();
};

// ✅ Middleware kiểm tra role (phân quyền)
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. Insufficient permissions",
        requiredRoles: allowedRoles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

// ✅ Shortcut middlewares cho các role phổ biến
export const isAdmin = authorize("admin");
export const isModerator = authorize("moderator");
export const isModeratorOrAdmin = authorize("admin", "moderator");

// ✅ Middleware kiểm tra owner hoặc admin
export const isOwnerOrAdmin = (resourceUserIdField: string = "userId") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Admin có thể truy cập mọi resource
    if (req.user.role === "admin") {
      return next();
    }

    // Kiểm tra xem user có phải owner không
    const resourceUserId = (req as any)[resourceUserIdField] || req.params.userId || req.body.userId;
    
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({ message: "You can only access your own resources" });
    }

    next();
  };
};

// ✅ Optional auth - không bắt buộc đăng nhập nhưng nếu có token thì decode
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        username: string;
        email: string;
        role: string;
        isVerified: boolean;
      };
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Token invalid nhưng vẫn cho qua (optional)
    next();
  }
};

// ✅ Giữ lại tên cũ để tương thích (nếu đã dùng ở nhiều nơi)
export const verifyAuth = authenticate;