import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("⚠️ MONGO_URI is missing from your .env.local file!");
}

// Global caching wrapper declaration for Next.js hot-reloads
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  // 1. Immediately reuse connection if already active
  if (cached.conn) {
    console.log("♻️  Next.js: Reusing existing MongoDB pool connection");
    return cached.conn;
  }

  // 2. Initialize new connection if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("⏳ MongoDB: Spawning new handshake instance...");

    cached.promise = mongoose
      .connect(MONGO_URI!, opts)
      .then((mongooseInstance) => {
        // 🚀 THIS FIXES YOUR ISSUE: Forces a terminal log on success
        console.log("==========================================");
        console.log("✅ MONGOOSE: MongoDB Connected Successfully!");
        console.log("==========================================");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MONGOOSE: Connection promise failed:", err.message);
        cached.promise = null; // Purge failed promise cache
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error("❌ MONGOOSE: Critical connection extraction error:", e);
    cached.promise = null; // Purge broken cache
    throw e;
  }
}
