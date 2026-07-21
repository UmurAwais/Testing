import express from "express";
import { loginUser, signupUser } from "../controllers/adminController.js";

const router = express.Router();

// Admin authentication
router.post("/login", loginUser);
router.post("/signup", signupUser);

export default router;
