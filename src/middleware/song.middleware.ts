import { Request, Response, NextFunction } from "express";
import { uploadSongWithCover } from "../utils/multer.utils";
import { sendErrorResponse } from "../utils/respone.utils";

const uploadSongMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  uploadSongWithCover(req, res, ((err: unknown) => {
    if (err) {
      console.error("Multer error:", err);
      const message = err instanceof Error ? err.message : "File upload error";
      sendErrorResponse(res, 400, message);
      return;
    }
    next();
  }) as NextFunction);
};

export { uploadSongMiddleware }; 