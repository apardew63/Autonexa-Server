import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import  verifyToken, { requireDealer }  from "../middleware/authMiddleware.js";
import {
  createListing,
  getUserListings,
  getAllListings,
  getListingById,
  getShowroomListings,
  updateListing,
  deleteListing,
} from "../controller/listingController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", verifyToken, upload.array("images", 5), createListing);
router.get("/me", verifyToken, getUserListings);
router.get("/showroom", verifyToken, requireDealer, getShowroomListings);
router.get("/", getAllListings);
router.get("/:id", getListingById);
router.put("/:id", verifyToken, upload.array("images", 5), updateListing);
router.delete("/:id", verifyToken, deleteListing);

export default router;
