import express, {Router} from "express";
import { addMessage, getMessage } from "../controllers/MessageController";

const router = express.Router();

router.post("/", addMessage);
router.get("/:chatId", getMessage);
export default router;