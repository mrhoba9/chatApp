import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { outgoingRequest } from "../controllers/friendController.js";
const router = express.Router();

router.post("/request", verifyJWT, outgoingRequest);


export default router;