import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const { name, level, description } = req.body;

    if (!name || !level || !description) {
      return res.status(400).json({
        message: "Please provide all course details",
      });
    }

    const image = req.file ? req.file.path : "";

    const course = await Course.create({
      name,
      level,
      description,
      image,
    });

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create Course Error:", error);

    return res.status(500).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Get Courses Error:", error);

    return res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Get Course Error:", error);

    return res.status(500).json({
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};
