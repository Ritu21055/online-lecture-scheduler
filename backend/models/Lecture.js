import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    batchName: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lectureDate: {
      type: Date,
      required: true,
    },

    lectureDay: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

lectureSchema.index({ instructor: 1, lectureDay: 1 }, { unique: true });

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
