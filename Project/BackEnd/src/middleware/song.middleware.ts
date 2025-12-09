import { uploadSongWithCover } from "../utils/multer";

// ✅ Wrapper để handle multer errors
const uploadSongMiddleware = (req: any, res: any, next: any) => {
  uploadSongWithCover(req, res, (err: any) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error"
      });
    }
    next();
  });
};

export { uploadSongMiddleware };