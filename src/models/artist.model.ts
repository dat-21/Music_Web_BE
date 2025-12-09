// src/models/artist.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IArtist extends Document {
  name: string;
  bio?: string;
  avatar?: string;
  debutYear?: number;
}

const artistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },
    bio: String,
    avatar: String,
    debutYear: Number,
  },
  { timestamps: true }
);

export default mongoose.model<IArtist>("Artist", artistSchema);
