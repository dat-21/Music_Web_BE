import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🧾 Logger middleware (tự log mỗi khi có request)
app.use((req: Request, res: Response, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toLocaleString()}`);
  next();
});

// Sample route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "🚀 Express + TypeScript backend is running!" });
});

// Another example route
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


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
