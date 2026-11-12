import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({
      role: "instructor",
    }).select("-password");

    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch instructors",
    });
  }
};

export const addInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const instructor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "instructor",
    });

    res.status(201).json({
      message: "Instructor added successfully",
      instructor: {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add instructor",
    });
  }
};
