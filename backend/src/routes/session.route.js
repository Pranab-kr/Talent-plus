import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/session.cotroller.js";

const router = Router();

router.post("/", protectedRoute, createSession);

router.get("/active", protectedRoute, getActiveSessions);

router.get("my-recent", protectedRoute, getMyRecentSessions);

router.get("/:id", protectedRoute, getSessionById);
router.get("/:id/join", protectedRoute, joinSession);
router.get("/:id/end", protectedRoute, endSession);

export default router;
