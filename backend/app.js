import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// CORS configuration with env-based allowlist
const parseOrigins = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const FRONTEND_URL = process.env.FRONTEND_URL;
const ALLOWED_ORIGINS = parseOrigins(process.env.ALLOWED_ORIGINS);
const corsOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  FRONTEND_URL,
  ...ALLOWED_ORIGINS,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error("CORS not allowed for this origin"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
    exposedHeaders: ["set-cookie"],
    maxAge: 86400, // 24 hours for preflight cache
  })
);

const port = process.env.PORT || 8000;

const __dirname = path.resolve();

import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// Health check route for uptime monitoring and platform health checks
app.get(["/", "/health", "/api/health"], (req, res) => {
  res.status(200).json({ status: "ok" });
});

if (process.env.NODE_ENV === "production") {
  // behind proxy (Render, Railway, etc.) trust proxy for secure cookies
  app.set("trust proxy", 1);
  // serve frontend build only when explicitly enabled and files exist
  const serveClient = process.env.SERVE_CLIENT === "true";
  const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");
  if (serveClient && fs.existsSync(indexPath)) {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));
    app.get(/.*/, (req, res) => {
      res.sendFile(indexPath);
    });
  }
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Create a .env file or set the env var.\nExample local: mongodb://127.0.0.1:27017/chatapp");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => {
    console.log("mongoDB connected:" + res.connection.host);
    server.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
