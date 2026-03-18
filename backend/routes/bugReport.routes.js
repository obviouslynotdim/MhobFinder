import express from "express";
import {
  createBugReport,
  getBugReportsForAdmin,
  updateBugReportStatus,
  deleteBugReport,
} from "../controllers/bugReport.controller.js";
import { verifyFirebaseToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, createBugReport);
router.get("/", verifyFirebaseToken, requireAdmin, getBugReportsForAdmin);
router.patch("/:reportId", verifyFirebaseToken, requireAdmin, updateBugReportStatus);
router.delete("/:reportId", verifyFirebaseToken, requireAdmin, deleteBugReport);

export default router;