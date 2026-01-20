import { Router } from "express";
import { getStreamToken } from "../controllers/chat-controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = Router();

router.get("/token", protectedRoute, getStreamToken);

export default router;
