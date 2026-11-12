import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
} from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCourses);
router.get("/:id", authMiddleware, getCourseById);
router.post(
  "/add",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  createCourse,
);

export default router;
