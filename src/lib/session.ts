import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7;
// 7 days

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function createSession(userId: string) {
  const client = await clientPromise;
  const db = client.db("sefirah");

  const token = crypto.randomBytes(32).toString("hex");

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION
  );

  await db.collection("sessions").insertOne({
    userId,
    tokenHash,
    expiresAt,
    createdAt: new Date(),
  });

  return {
    token,
    expiresAt,
  };
}