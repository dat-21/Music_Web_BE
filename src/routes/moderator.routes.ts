import express from "express";
import { authenticate, isModeratorOrAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateSongSchema, songIdParamSchema } from "../validations/song.validation";
import * as songController from "../controllers/song.controller";
import { ROUTE_PATHS } from "@dat-21/contracts";

const router = express.Router();

router.use(authenticate);
router.use(isModeratorOrAdmin);

router.get(ROUTE_PATHS.songs.pending, songController.getPendingSongs);

router.put(
  ROUTE_PATHS.songs.update,
  validate({ body: updateSongSchema, params: songIdParamSchema }),
  songController.updateSong
);

router.post(
  ROUTE_PATHS.songs.approve,
  validate({ params: songIdParamSchema }),
  songController.approveSong
);

export default router;
