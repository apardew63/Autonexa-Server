import express from "express";
const router = express.Router();
import verifyToken from "../middleware/authMiddleware.js";
import { getUserDashboard, getDealerDashboard } from "../controller/dashboardController.js";

router.get("/", verifyToken, (req, res) => {
  if (req.user.role === 'dealer') {
    return getDealerDashboard(req, res);
  } else {
    return getUserDashboard(req, res);
  }
});

// Add missing dashboard routes
router.get("/add-car", verifyToken, (req, res) => {
  // This is a frontend route, but we'll return a simple response for now
  res.json({ message: "Add car page - frontend route" });
});

router.get("/analytics", verifyToken, (req, res) => {
  // This is a frontend route, but we'll return a simple response for now
  res.json({ message: "Analytics page - frontend route" });
});

export default router;