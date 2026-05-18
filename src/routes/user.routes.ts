import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createPlaylistSchema, updatePlaylistSchema, addSongToPlaylistSchema, playlistIdParamSchema } from "../validations";
import * as playlistController from "../controllers/playlist.controller";
import { ROUTE_PATHS } from "../../../shared/contracts";

const router = express.Router();

router.use(authenticate);

router.get(ROUTE_PATHS.playlists.mine, playlistController.getMyPlaylists);

router.post(
  ROUTE_PATHS.playlists.list,
  validate(createPlaylistSchema),
  playlistController.createPlaylist
);

router.put(
  ROUTE_PATHS.playlists.detail,
  validate({ body: updatePlaylistSchema, params: playlistIdParamSchema }),
  playlistController.updatePlaylist
);

router.delete(
  ROUTE_PATHS.playlists.detail,
  validate({ params: playlistIdParamSchema }),
  playlistController.deletePlaylist
);

router.post(
  ROUTE_PATHS.playlists.addSong,
  validate({ body: addSongToPlaylistSchema, params: playlistIdParamSchema }),
  playlistController.addSongToPlaylist
);

router.delete(
  ROUTE_PATHS.playlists.removeSong,
  playlistController.removeSongFromPlaylist
);

export default router;
