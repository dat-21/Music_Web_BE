import express from "express";
import { authenticate, isModeratorOrAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateSongSchema, songIdParamSchema } from "../validations/song.validation";
import * as songController from "../controllers/song.controller";

const router = express.Router();

router.use(authenticate);
router.use(isModeratorOrAdmin);

router.get("/pending-songs", songController.getPendingSongs);

router.put(
  "/songs/:id",
  validate({ body: updateSongSchema, params: songIdParamSchema }),
  songController.updateSong
);

router.post(
  "/songs/:id/approve",
  validate({ params: songIdParamSchema }),
  songController.approveSong
);

export default router;
