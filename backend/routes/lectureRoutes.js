import express from "express";

import {
  createLecture,
  getLectures,
  getMyLectures,
} from "../controllers/lectureController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all scheduled lectures
router.get("/", authMiddleware, roleMiddleware("admin"), getLectures);

// Schedule a lecture (Admin only)
router.post("/add", authMiddleware, roleMiddleware("admin"), createLecture);

// Instructor can see their own lectures
router.get(
  "/my-lectures",
  authMiddleware,
  roleMiddleware("instructor"),
  getMyLectures,
);

export default router;
