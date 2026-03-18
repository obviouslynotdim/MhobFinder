import BugReport from "../models/bugReport.js";
import Food from "../models/food.js";
import User from "../models/user.js";
import { Op } from "sequelize";

const REPORT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MAX_REPORTS_PER_DAY = 3;
const ALLOWED_STATUSES = ["open", "in_review", "resolved", "rejected"];
const REASON_LABELS = {
  incorrect_ingredients: "Incorrect Ingredients",
  recipe_missing: "The recipe no longer exists",
  wrong_image: "Wrong Image",
  incorrect_cuisine: "Incorrect Cuisine",
  wrong_meal_type: "Wrong Meal Type",
  video_not_working: "Video doesn't work",
  other: "Other",
};

export const createBugReport = async (req, res, next) => {
  try {
    const { food_id, reason_code, details, description } = req.body;
    const normalizedReason = String(reason_code || "").trim().toLowerCase();
    const trimmedDetails = String(details || description || "").trim();

    if (!food_id) {
      return res.status(400).json({ error: "food_id is required" });
    }

    const effectiveReason = normalizedReason || "other";

    if (!REASON_LABELS[effectiveReason]) {
      return res.status(400).json({
        error: `reason_code must be one of: ${Object.keys(REASON_LABELS).join(", ")}`,
      });
    }

    const existingFood = await Food.findByPk(food_id);
    if (!existingFood) {
      return res.status(404).json({ error: "Food not found" });
    }

    const windowStart = new Date(Date.now() - REPORT_COOLDOWN_MS);
    const recentReports = await BugReport.findAll({
      where: {
        user_id: req.user.user_id,
        createdAt: {
          [Op.gte]: windowStart,
        },
      },
      order: [["createdAt", "ASC"]],
    });

    if (recentReports.length >= MAX_REPORTS_PER_DAY) {
      const oldestInWindow = recentReports[0];
      const nextAllowedAt = new Date(
        new Date(oldestInWindow.createdAt).getTime() + REPORT_COOLDOWN_MS,
      );
      return res.status(429).json({
        error: "You can submit up to 3 bug reports per day.",
        nextAllowedAt: nextAllowedAt.toISOString(),
      });
    }

    const report = await BugReport.create({
      user_id: req.user.user_id,
      food_id,
      reason_code: effectiveReason,
      description: trimmedDetails || REASON_LABELS[effectiveReason],
      status: "open",
    });

    return res.status(201).json(report);
  } catch (err) {
    return next(err);
  }
};

export const getBugReportsForAdmin = async (req, res, next) => {
  try {
    if (!req.userIsAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const status = String(req.query.status || "all").trim().toLowerCase();
    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

    const reports = await BugReport.findAll({
      where,
      include: [
        {
          model: User,
          as: "reporter",
          attributes: ["user_id", "name", "email", "image_url"],
        },
        {
          model: Food,
          as: "food",
          attributes: ["food_id", "title", "image_url"],
        },
        {
          model: User,
          as: "handledBy",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(reports);
  } catch (err) {
    return next(err);
  }
};

export const updateBugReportStatus = async (req, res, next) => {
  try {
    if (!req.userIsAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { reportId } = req.params;
    const nextStatus = String(req.body?.status || "").trim().toLowerCase();
    const adminNote = String(req.body?.admin_note || "").trim();

    if (!ALLOWED_STATUSES.includes(nextStatus)) {
      return res.status(400).json({
        error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const report = await BugReport.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    report.status = nextStatus;
    report.admin_note = adminNote || null;
    report.handled_by = req.user.user_id;
    report.handled_at = new Date();
    await report.save();

    const updated = await BugReport.findByPk(report.report_id, {
      include: [
        {
          model: User,
          as: "reporter",
          attributes: ["user_id", "name", "email", "image_url"],
        },
        {
          model: Food,
          as: "food",
          attributes: ["food_id", "title", "image_url"],
        },
        {
          model: User,
          as: "handledBy",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
};

export const deleteBugReport = async (req, res, next) => {
  try {
    if (!req.userIsAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { reportId } = req.params;
    const deletedCount = await BugReport.destroy({
      where: { report_id: reportId },
    });

    if (!deletedCount) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    return res.status(200).json({ message: "Bug report deleted" });
  } catch (err) {
    return next(err);
  }
};