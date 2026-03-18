import express from "express";
import {
  createBugReport,
  getBugReportsForAdmin,
  updateBugReportStatus,
  deleteBugReport,
} from "../controllers/bugReport.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, createBugReport);
router.get("/", verifyFirebaseToken, getBugReportsForAdmin);
router.patch("/:reportId", verifyFirebaseToken, updateBugReportStatus);
router.delete("/:reportId", verifyFirebaseToken, deleteBugReport);

export default router;