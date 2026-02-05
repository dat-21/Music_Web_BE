import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../enums";

// Interface cho lịch sử nghe nhạc
export interface IListenHistoryItem {
  songId: Types.ObjectId;
  position: number;    // Giây đang nghe
  updatedAt: Date;     // Thời gian cập nhật
}

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
  listenHistory: IListenHistoryItem[];
} 

// Sub-schema cho lịch sử nghe nhạc
const listenHistoryItemSchema = new Schema<IListenHistoryItem>(
  {
    songId: { type: Schema.Types.ObjectId, ref: "Song", required: true },
    position: { type: Number, required: true, default: 0 },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

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
    listenHistory: {
      type: [listenHistoryItemSchema],
      default: []
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export { User };
export default User;