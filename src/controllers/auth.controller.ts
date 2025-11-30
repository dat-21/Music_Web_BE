import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";


export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword, email, role } = req.body;

    // ✅ Validation
    if (!username || !password || !confirmPassword || !email) {
      return res.status(400).json({ 
        message: "Username, email, and password are required" 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Kiểm tra trùng username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // ✅ Kiểm tra trùng email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
 
    // Tạo user mới
    const newUser = new User({ 
      username, 
      email, // ✅ Thêm email
      password: hashedPassword,
      role: role && ["admin", "moderator"].includes(role) ? role : "user",
      isVerified: true // ✅ Tạm thời set true để test, sau này sẽ dùng email verification
    });
    
    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully!", 
      user: { 
        username: newUser.username,
        email: newUser.email // ✅ Trả về email
      } 
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Đăng nhập

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ✅ Bỏ kiểm tra email verification (tạm thời không cần)

    // ✅ Generate token với đầy đủ thông tin
    const token = generateToken({ 
      id: user._id.toString(),
      username: user.username,
      email: user.email, // ✅ Thêm email vào token
      isVerified: user.isVerified,
      role: user.role  
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ 
      message: "Login successful!", 
      user: {
        id: user._id,
        username: user.username,
        email: user.email, // ✅ Trả về email
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Đăng xuất
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};


// =========================
// GET USER FROM COOKIE (AUTH ME)
// =========================
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user.id)
      .select("username email role isVerified createdAt"); // ✅ Thêm email

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};