import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { uploadSongMiddleware } from "../middleware/song.middleware";
import { validate } from "../middleware/validate.middleware";
import { songIdParamSchema } from "../validations/song.validation";
import * as songController from "../controllers/song.controller";
import * as userController from "../controllers/user.controller";
import { ROUTE_PATHS } from "../../../shared/contracts";

const router = express.Router();

router.use(authenticate);
router.use(isAdmin);

router.post(ROUTE_PATHS.songs.upload, uploadSongMiddleware, songController.uploadSong);

router.delete(
  ROUTE_PATHS.songs.detail,
  validate({ params: songIdParamSchema }),
  songController.deleteSong
);

router.get(ROUTE_PATHS.admin.users, userController.getAllUsers);

router.delete(ROUTE_PATHS.admin.userDetail, userController.deleteUser);

export default router;
