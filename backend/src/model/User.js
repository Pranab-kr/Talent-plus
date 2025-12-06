import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
    },
  },
  { timestamps: true } // createdAt and updatedAt fields
);

export const User = mongoose.model("User", userSchema);
