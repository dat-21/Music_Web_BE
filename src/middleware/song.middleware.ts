import { Request, Response, NextFunction } from "express";
import { uploadSongWithCover } from "../utils/multer.utils";

const uploadSongMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  uploadSongWithCover(req, res, ((err: unknown) => {
    if (err) {
      console.error("Multer error:", err);
      const message = err instanceof Error ? err.message : "File upload error";
      res.status(400).json({
        success: false,
        message,
      });
      return;
    }
    next();
  }) as NextFunction);
};

export { uploadSongMiddleware }; 