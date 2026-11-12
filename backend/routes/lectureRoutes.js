import express from "express";

import {
  createLecture,
  getLectures,
  getMyLectures,
} from "../controllers/lectureController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getLectures);

router.post("/add", authMiddleware, roleMiddleware("admin"), createLecture);

router.get(
  "/my-lectures",
  authMiddleware,
  roleMiddleware("instructor"),
  getMyLectures,
);

export default router;
