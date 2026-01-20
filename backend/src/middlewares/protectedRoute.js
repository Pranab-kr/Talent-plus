import { requireAuth } from "@clerk/express";
import { User } from "../model/User.js";

export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId } = req.auth;

      // Check if the user exists in the database
      let user = await User.findOne({ clerkId: userId });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      // Attach user to request object for further use
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protected route middleware:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
