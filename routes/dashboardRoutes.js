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

export default router;