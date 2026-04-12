import { FilterQuery } from "mongoose";
import { User, IUser } from "../models/user.model";

export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

export const findUserByIdSafe = async (id: string): Promise<IUser | null> => {
  return User.findById(id).select("-password -verifyToken -verifyTokenExpires");
};

export const findUserByUsername = async (
  username: string
): Promise<IUser | null> => {
  return User.findOne({ username });
};

export const findUserByEmail = async (
  email: string
): Promise<IUser | null> => {
  return User.findOne({ email });
};

export const findAllUsers = async (
  filter: FilterQuery<IUser>,
  skip: number,
  limit: number
): Promise<IUser[]> => {
  return User.find(filter)
    .select("-password -verifyToken -verifyTokenExpires")
    .skip(skip)
    .limit(limit);
};

export const countUsers = async (
  filter: FilterQuery<IUser> = {}
): Promise<number> => {
  return User.countDocuments(filter);
};

export const createUser = async (
  data: Partial<IUser>
): Promise<IUser> => {
  const user = new User(data);
  return user.save();
};

export const deleteUserById = async (id: string): Promise<IUser | null> => {
  return User.findByIdAndDelete(id);
};
