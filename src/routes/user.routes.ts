import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createPlaylistSchema, updatePlaylistSchema, addSongToPlaylistSchema, playlistIdParamSchema } from "../validations";
import * as playlistController from "../controllers/playlist.controller";

const router = express.Router();

router.use(authenticate);

router.get("/my-playlists", playlistController.getMyPlaylists);

router.post(
  "/playlists",
  validate(createPlaylistSchema),
  playlistController.createPlaylist
);

router.put(
  "/playlists/:id",
  validate({ body: updatePlaylistSchema, params: playlistIdParamSchema }),
  playlistController.updatePlaylist
);

router.delete(
  "/playlists/:id",
  validate({ params: playlistIdParamSchema }),
  playlistController.deletePlaylist
);

router.post(
  "/playlists/:id/songs",
  validate({ body: addSongToPlaylistSchema, params: playlistIdParamSchema }),
  playlistController.addSongToPlaylist
);

router.delete(
  "/playlists/:id/songs/:songId",
  playlistController.removeSongFromPlaylist
);

export default router;
