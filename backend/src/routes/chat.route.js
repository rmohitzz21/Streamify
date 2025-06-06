import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controller/chat.controller.js";

const router = express.Router();

// protect Route is used to only authenticated users can access the chat routes
router.get("/token", protectRoute, getStreamToken);

export default router;