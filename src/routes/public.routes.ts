import express from "express";
import { optionalAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { songIdParamSchema } from "../validations/song.validation";
import * as songController from "../controllers/song.controller";
import * as recommendationController from "../controllers/recommendation.controller";
import { ROUTE_PATHS } from "../../../shared/contracts";

const router = express.Router();

router.get(ROUTE_PATHS.songs.list, songController.getAllSongs);

router.get(
  ROUTE_PATHS.songs.detail,
  validate({ params: songIdParamSchema }),
  songController.getSongById
);

router.get(ROUTE_PATHS.songs.recommendations, optionalAuth, recommendationController.getRecommendations);

export default router;
