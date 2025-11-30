import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import route from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// Middleware
app.use(cors({ origin:[ FRONTEND_URL, "http://localhost:5174"], credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🧾 Logger middleware
app.use((req: Request, res: Response, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toLocaleString()}`);
  next();
});

// Routes
route(app);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "🚀 Express + TypeScript + MongoDB backend is running!" });
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "This is /api/test" });
});

app.get("/error", (req: Request, res: Response) => {
  throw new Error("Test error");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`❌ [${req.method}] ${req.path} -> ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error", 
  });
});

// Kết nối MongoDB và start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});