import { Session } from "../model/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

export const createSession = async (req, res) => {
  try {
    const { problem, deficulty } = req.body;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !deficulty) {
      return res
        .status(400)
        .json({ error: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await Session.create({
      problem,
      deficulty,
      host: userId,
      callId,
    });

    //create stream video call;
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by: clerkId,
        custiom: {
          problem,
          deficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `Session Chat - ${problem}`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getActiveSessions = async (req, res) => {};

export const getMyRecentSessions = async (req, res) => {};

export const getSessionById = async (req, res) => {};

export const joinSession = async (req, res) => {};

export const endSession = async (req, res) => {};
