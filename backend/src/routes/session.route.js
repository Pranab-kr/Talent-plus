import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createSession,
  getActiveSessions,
} from "../controllers/session.cotroller.js";

const router = Router();

router.post("/", protectedRoute, createSessionon);

router.get("/active", protectedRoute, getActiveSessionseSessions);

export default router;
