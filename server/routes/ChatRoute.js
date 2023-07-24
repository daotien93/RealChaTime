import express from "express";
import { createChat, findChat, userChat } from "../controllers/ChatController";

const router = express.Router();

router.post("/", createChat);
router.post("/:userId", userChat);
router.get("/find/:firstId/:secondId", findChat);

export default router;