import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import dns from "node:dns";

// Force Node.js to use Google Public DNS to bypass local SRV lookup blocks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

/*
 * =========================================================
 * NATIVE MONGODB CLIENT
 * =========================================================
 *
 * Used by auth.ts, session.ts, and all the filesystem /
 * cooking inventory API routes that call db.collection(...)
 * directly. Do not remove — this is the existing default
 * export everything else depends on.
 */

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongooseConn?: Promise<typeof mongoose>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
}

clientPromise = globalWithMongo._mongoClientPromise;

export default clientPromise;

/*
 * =========================================================
 * MONGOOSE CONNECTION
 * =========================================================
 *
 * Used by mongoose-based models (e.g. CookingProgress).
 * Cached on `global` the same way as the native client so
 * serverless invocations reuse the connection instead of
 * opening a new one every request.
 */

export async function connectDB() {
  if (!globalWithMongo._mongooseConn) {
    globalWithMongo._mongooseConn = mongoose.connect(uri);
  }

  return globalWithMongo._mongooseConn;
}