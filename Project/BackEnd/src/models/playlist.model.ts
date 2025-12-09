// src/models/playlist.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  user: Types.ObjectId;   // owner
  songs: Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true },
    description: String,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPlaylist>("Playlist", playlistSchema);
