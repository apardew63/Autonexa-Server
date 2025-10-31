import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../model/User.js";
import { register, login } from "../controller/authController.js";

const router = express.Router();

// Email/Password routes
router.post("/register", register);
router.post("/login", login);

router.get("/verify", authMiddleware, (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});


export default router;
