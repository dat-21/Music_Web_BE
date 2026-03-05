import { Router } from "express";
import {
  updateListenPosition,
  getListenPosition,
  getListenHistory,
  removeFromHistory,
  clearHistory,
} from "../controllers/history.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateListenPositionSchema, historySongIdParamSchema } from "../validations/history.validation";

const router = Router();

router.post(
  "/position",
  authenticate,
  validate(updateListenPositionSchema),
  updateListenPosition
);

router.get(
  "/position/:songId",
  authenticate,
  validate({ params: historySongIdParamSchema }),
  getListenPosition
);

router.get("/", authenticate, getListenHistory);

router.delete(
  "/:songId",
  authenticate,
  validate({ params: historySongIdParamSchema }),
  removeFromHistory
);

router.delete("/clear/all", authenticate, clearHistory);

export default router;
