import Lecture from "../models/Lecture.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Create a new lecture
export const createLecture = async (req, res) => {
  try {
    const { course, batchName, instructor, lectureDate } = req.body;

    // Check required fields
    if (!course || !batchName || !instructor || !lectureDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if course exists
    const courseExists = await Course.findById(course);

    if (!courseExists) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check if instructor exists
    const instructorExists = await User.findOne({
      _id: instructor,
      role: "instructor",
    });

    if (!instructorExists) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    // Validate lecture date
    const lectureDay = String(lectureDate).slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(lectureDay)) {
      return res.status(400).json({
        message: "Invalid lecture date",
      });
    }

    const parsedDate = new Date(`${lectureDay}T00:00:00.000Z`);

    if (
      isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== lectureDay
    ) {
      return res.status(400).json({
        message: "Invalid lecture date",
      });
    }

    // Check whether instructor already has a lecture on this date
    const existingLecture = await Lecture.findOne({
      instructor,
      lectureDay,
    });

    if (existingLecture) {
      return res.status(409).json({
        message: "This instructor already has a lecture on this date",
      });
    }

    // Save lecture in database
    const lecture = await Lecture.create({
      course,
      batchName,
      instructor,
      lectureDate: parsedDate,
      lectureDay,
    });

    return res.status(201).json({
      message: "Lecture scheduled successfully",
      lecture,
    });
  } catch (error) {
    console.error("Create Lecture Error:", error);

    // Handle duplicate database entries
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This instructor already has a lecture on this date",
      });
    }

    return res.status(500).json({
      message: "Failed to schedule lecture",
      error: error.message,
    });
  }
};

// Get all lectures (Admin)
export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate("course", "name level")
      .populate("instructor", "name email")
      .sort({ lectureDate: 1 });

    return res.status(200).json(lectures);
  } catch (error) {
    console.error("Get Lectures Error:", error);

    return res.status(500).json({
      message: "Failed to fetch lectures",
      error: error.message,
    });
  }
};

// Get lectures assigned to logged-in instructor
export const getMyLectures = async (req, res) => {
  try {
    const instructorId = req.user.userId;

    const lectures = await Lecture.find({
      instructor: instructorId,
    })
      .populate("course", "name level description image")
      .populate("instructor", "name email")
      .sort({ lectureDate: 1 });

    return res.status(200).json(lectures);
  } catch (error) {
    console.error("Get My Lectures Error:", error);

    return res.status(500).json({
      message: "Failed to fetch your lectures",
      error: error.message,
    });
  }
};
