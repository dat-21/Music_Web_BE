// routes/music.routes.ts
import express from "express";
import {
  authenticate,
} from "../middleware/auth.middleware";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { ROUTE_PATHS } from "@dat-21/contracts";

const router = express.Router();
router.post(
  ROUTE_PATHS.auth.register,
  validate(registerSchema),
  authController.register
);
router.post(
  ROUTE_PATHS.auth.login,
  validate(loginSchema),
  authController.login
);
router.post(ROUTE_PATHS.auth.logout, authenticate, authController.logout);
router.get(ROUTE_PATHS.auth.me, authenticate, authController.getCurrentUser);
export default router;