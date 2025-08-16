import express from "express";
import { sendMessage, getMessage } from "../controllers/messageController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
const router = express.Router();

router.post("/send", verifyJWT, sendMessage);
router.post("/get", verifyJWT, getMessage);

export default router;