import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../enums";

export interface IUser extends Document {
   _id: Types.ObjectId;
  username: string;
  password: string; 
  role: UserRole;
  email: string;
  createdAt: Date;
  isVerified: boolean;
  verifyToken: String;
  verifyTokenExpires: Date;
} 

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
     role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  },
    isVerified: {
      type: Boolean,
      default: false
    },

    verifyToken: {
      type: String,
      default: null
    },

    verifyTokenExpires: {
      type: Date,
      default: null
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
