import express from "express";
import { optionalAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { songIdParamSchema } from "../validations/song.validation";
import * as songController from "../controllers/song.controller";
import * as recommendationController from "../controllers/recommendation.controller";

const router = express.Router();

router.get("/songs", songController.getAllSongs);

router.get(
  "/songs/:id",
  validate({ params: songIdParamSchema }),
  songController.getSongById
);

router.get("/recommendations", optionalAuth, recommendationController.getRecommendations);

export default router;
