import { Application } from "express";
import authRoutes from "./auth.routes";
import musicRoutes from "./music.routes";
import aiChatbotRoutes from "./ai-chatbot.routes";
import historyRoutes from "./history.routes";

export default function route(app: Application): void {
    app.use("/api/auth", authRoutes);
    app.use("/api/music", musicRoutes);
    app.use("/api/ai-chatbot", aiChatbotRoutes);
    app.use("/api/history", historyRoutes);
}