import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
}

// ✅ Helper function để lấy JWT_SECRET
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("⚠️ JWT_SECRET is not defined in environment variables!");
  }
  return secret;
};

export const generateToken = (
  payload: TokenPayload, 
  expiresIn: string = "7d"
): string => {
  return jwt.sign(payload, getJWTSecret(), { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, getJWTSecret()) as JwtPayload;
    
    if (!decoded.id || !decoded.username || !decoded.role) {
      throw new Error("Invalid token payload");
    }
    
    return decoded as TokenPayload;
  } catch (error) {
    throw error;
  }
};