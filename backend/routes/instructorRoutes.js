import express from "express";
import {
  getInstructors,
  addInstructor,
} from "../controllers/instructorController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getInstructors);
router.post("/add", authMiddleware, roleMiddleware("admin"), addInstructor);

export default router;
