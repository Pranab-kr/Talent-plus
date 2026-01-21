import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "Stream API key and secret must be set in environment variables.",
  );
}

//for chat functionality
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

//for video call functionality
export const streamClient = new StreamClient(apiKey, apiSecret);

//usertUser means create and update user
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);

    console.log(`Stream user with ID ${userData.id} upserted successfully.`);
  } catch (err) {
    console.error("Error upserting Stream user:", err);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);

    console.log(`Stream user with ID ${userId} deleted successfully.`);

    return userData;
  } catch (err) {
    console.error("Error deleting Stream user:", err);
  }
};
