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
import { ROUTE_PATHS } from "../../../shared/contracts";

const router = Router();

router.post(
  ROUTE_PATHS.history.position,
  authenticate,
  validate(updateListenPositionSchema),
  updateListenPosition
);

router.get(
  ROUTE_PATHS.history.positionBySong,
  authenticate,
  validate({ params: historySongIdParamSchema }),
  getListenPosition
);

router.get(ROUTE_PATHS.history.list, authenticate, getListenHistory);

router.delete(
  ROUTE_PATHS.history.remove,
  authenticate,
  validate({ params: historySongIdParamSchema }),
  removeFromHistory
);

router.delete(ROUTE_PATHS.history.clear, authenticate, clearHistory);

export default router;
