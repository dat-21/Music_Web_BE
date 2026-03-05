import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { uploadSongMiddleware } from "../middleware/song.middleware";
import { validate } from "../middleware/validate.middleware";
import { songIdParamSchema } from "../validations/song.validation";
import * as songController from "../controllers/song.controller";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.use(authenticate);
router.use(isAdmin);

router.post("/songs", uploadSongMiddleware, songController.uploadSong);

router.delete(
  "/songs/:id",
  validate({ params: songIdParamSchema }),
  songController.deleteSong
);

router.get("/users", userController.getAllUsers);

router.delete("/users/:id", userController.deleteUser);

export default router;
