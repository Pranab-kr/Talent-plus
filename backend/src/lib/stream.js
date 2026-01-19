import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "Stream API key and secret must be set in environment variables.",
  );
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

//usertUser means create and update user
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.usertUser(userData);

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

//todo: add another fnc for gentoken
