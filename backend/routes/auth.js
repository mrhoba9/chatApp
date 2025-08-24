import express from "express";
import { signup, signin, logout } from "../controllers/authController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

// /api/auth/check
router.get("/check", verifyJWT, (req, res) => {
    res.json({ exists: true });
});

export default router;