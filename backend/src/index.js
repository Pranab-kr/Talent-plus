import "dotenv/config";
import express from "express";
import path from "path";
import { connectDB } from "./db/connection.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, inngestFunctions } from "./lib/inngest.js";

const app = express();

const __dirname = path.resolve();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow cookies to be sent with requests
  }),
);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: inngestFunctions,
  }),
);

app.get("/health", (req, res) => {
  res.json("Server is up and running");
});

//make app ready for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("APP is running....");
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database", error);
  });
