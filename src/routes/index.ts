import { Application } from "express";
import authRoutes from "./auth.routes";
import musicRoutes from "./music.routes"; // Thêm dòng này

export default function route(app: Application): void {
    app.use("/api/auth", authRoutes);
    app.use("api/", musicRoutes); 

}