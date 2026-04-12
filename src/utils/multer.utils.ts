// utils/multer.ts - Multer config for file upload
import multer from "multer";

// ✅ Chỉ cho phép file audio
const ALLOWED_AUDIO_MIMETYPES = [
  "audio/mpeg",      // mp3
  "audio/mp3",       // mp3
  "audio/wav",       // wav
  "audio/wave",      // wav
  "audio/x-wav",     // wav
  "audio/flac",      // flac
  "audio/ogg",       // ogg
  "audio/aac",       // aac
];

// ✅ Chỉ cho phép file ảnh
const ALLOWED_IMAGE_MIMETYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ✅ Giới hạn 100MB (Cloudinary free plan hỗ trợ tới 100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// ✅ File filter for audio only
const audioFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_AUDIO_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only audio files are allowed (mp3, wav, flac, etc.)`));
  }
};
 
// ✅ File filter for audio + image
const audioWithCoverFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === "audio" && ALLOWED_AUDIO_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "coverImage" && ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Expected audio or image file.`));
  }
};

// ✅ Multer config - Audio only
const uploadAudio = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE, // 100MB
  },
  fileFilter: audioFileFilter,
});

// ✅ Multer config - Audio + Cover Image
const uploadWithCover = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE, // 100MB for audio
  },
  fileFilter: audioWithCoverFilter,
});

export const uploadSingle = uploadAudio.single("audio"); // Field name: "audio"
export const uploadSongWithCover = uploadWithCover.fields([
  { name: "audio", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
export const uploadMultiple = uploadAudio.array("audios", 50); // Max 50 files

export default uploadAudio;
