import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { outgoingRequest, incomingRequests, approveRequest, rejectRequest, listFriends, removeFriend } from "../controllers/friendController.js";
const router = express.Router();

router.post("/request", verifyJWT, outgoingRequest);
router.get("/receive", verifyJWT, incomingRequests);
router.post("/approve", verifyJWT, approveRequest);
router.post("/reject", verifyJWT, rejectRequest);
router.get("/list", verifyJWT, listFriends);
router.post("/unfriend", verifyJWT, removeFriend);

export default router;