// routes/music.routes.ts
import express from "express";
import { 
  authenticate,
} from "../middleware/auth.middleware";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const router = express.Router();
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);
router.post(
  "/login",
  validate(loginSchema),
  authController.login
);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getCurrentUser);
export default router;