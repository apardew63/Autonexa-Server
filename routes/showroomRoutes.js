import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import verifyToken, { requireDealer } from "../middleware/authMiddleware.js";
import {
  createShowroom,
  getMyShowroom,
  updateShowroom,
  getAllShowrooms,
  getShowroomById,
  upload,
} from "../controller/showroomController.js";

router.post("/", verifyToken, requireDealer, upload.single("logo"), createShowroom);
router.get("/me", verifyToken, requireDealer, getMyShowroom);
router.put("/me", verifyToken, requireDealer, upload.single("logo"), updateShowroom);
router.get("/", getAllShowrooms);
router.get("/:id", getShowroomById);

export default router;