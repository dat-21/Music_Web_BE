// src/models/album.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAlbum extends Document {
  title: string;
  artist: Types.ObjectId[];
  coverImage?: string; 
  releaseDate?: Date;
  songs: Types.ObjectId[];
}

const albumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true },
    artist: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    coverImage: String,
    releaseDate: Date,
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }]
  },
  { timestamps: true }
);

const Album = mongoose.model<IAlbum>("Album", albumSchema);
export default Album;
export { Album };