// src/models/song.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISong extends Document {
  _id: Types.ObjectId;
  title: string;
  artist: string; // Đổi thành string để dễ dùng
  album?: string; // Đổi thành string
  fileUrl: string; // URL từ Cloudinary
  fileKey: string; // Public ID để xóa file
  duration: number; // Thời lượng (giây)
  size: number; // Kích thước file (bytes)
  genres?: string[];
  coverUrl?: string; // URL ảnh bìa
  uploadedBy: Types.ObjectId;
  plays: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  status: "pending" | "approved" | "rejected";
}

const songSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true }, // String thay vì ObjectId
    album: { type: String, trim: true }, // String thay vì ObjectId
    fileUrl: { type: String, required: true }, // URL file nhạc
    fileKey: { type: String, required: true }, // Cloudinary public_id
    duration: { type: Number, required: true },
    size: { type: Number, required: true },
    genres: [{ type: String }],
    coverUrl: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    }
  },
  { timestamps: true }
);

// Index để tìm kiếm nhanh
songSchema.index({ title: "text" });
songSchema.index({ artist: 1 });
songSchema.index({ title: "text", artist: "text" });
const Song = mongoose.model<ISong>("Song", songSchema);
export default Song;
export { Song };