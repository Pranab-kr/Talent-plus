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
        custom: {
          problem,
          deficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    // chat messaging channel for the session
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

export const getActiveSessions = async (_, res) => {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name email profileImage clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error fetching active sessions:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyRecentSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participants: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error fetching recent sessions:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participants", "name email profileImage clerkId");

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error fetching session by ID:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinSession = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.participants) {
      return res.status(400).json({ error: "Session is already full" });
    }

    session.participants = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error joining session:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const endSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.host.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Only the host can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ error: "Session is already completed" });
    }

    session.status = "completed";

    await session.save();

    //delete video call from streamClient
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    //delete chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error ending session:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};
