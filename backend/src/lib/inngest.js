import { Inngest } from "inngest";
import { connectDB } from "../db/connection.js";
import { User } from "../model/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-plus" });

// Function to sync a new user from Clerk to our database
export const syncUser = inngest.createFunction(
  { id: "sync-user" }, // function metadata
  { event: "clerk/user.created" }, // event trigger
  async ({ event }) => {
    // handler
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const existingUser = await User.findOne({ clerkId: id });
    if (existingUser) {
      console.log(`User with clerkId ${id} already exists.`);
      return;
    }

    const newUser = new User({
      name: `${first_name || ""} ${last_name || ""}`,
      email: email_addresses?.[0]?.email_address || "",
      profileImage: image_url || "",
      clerkId: id,
    });

    await newUser.save();
    console.log(`New user created with clerkId ${id}`);

    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  },
);

// Function to delete a user from our database when deleted in Clerk
export const deleteUser = inngest.createFunction(
  { id: "delete-user" }, // function name
  { event: "clerk/user.deleted" }, // event trigger
  async ({ event }) => {
    await connectDB();

    const { id } = event.data; // Clerk user ID (clerkId)

    const deletedUser = await User.findOneAndDelete({ clerkId: id });

    if (!deletedUser) {
      console.log(`No user found with clerkId ${id}. Nothing to delete.`);
      return;
    }

    console.log(`User with clerkId ${id} has been deleted.`);

    deleteStreamUser(deletedUser._id.toString());
  },
);

export const inngestFunctions = [syncUser, deleteUser];
