import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB CONNECTED");

    const users = [
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      },
      {
        name: "Ritu",
        email: "ritu@gmail.com",
        password: process.env.INSTRUCTOR_PASSWORD,
        role: "instructor",
      },
      {
        name: "Priya",
        email: "priya@gmail.com",
        password: process.env.INSTRUCTOR_PASSWORD,
        role: "instructor",
      },
    ];

    //create users
    for (const user of users) {
      if (!user.password) {
        throw new Error("User password missing in .env");
      }

      const existingUser = await User.findOne({
        email: user.email,
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
          ...user,
          password: hashedPassword,
        });
        console.log(user.email, "created successfully");
      } else {
        console.log(user.email, "already exists");
      }
    }
  } catch (error) {
    console.log("Seed error: ", error.message);
  } finally {
    await mongoose.disconnect();
  }
};
seedUsers();
