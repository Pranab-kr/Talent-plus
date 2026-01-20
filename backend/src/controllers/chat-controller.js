import { chatClient } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    //use clerkId as userId in stream not mongo _id
    const token = chatClient.createToken(req.user.clerkId);

    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.profileImage,
    });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
