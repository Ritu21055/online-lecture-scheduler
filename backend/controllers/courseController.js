import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const { name, level, description } = req.body;
    if (!name || !level || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const course = await Course.create({
      name,
      level,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });
    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create course",
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
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

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course",
    });
  }
};
