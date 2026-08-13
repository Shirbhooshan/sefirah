import crypto from "crypto";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("sefirah_session")?.value;

  if (!sessionToken) return null;

  const client = await clientPromise;
  const db = client.db("sefirah");

  const tokenHash = hashToken(sessionToken);

  const session = await db.collection("sessions").findOne({
    tokenHash,
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.collection("sessions").deleteOne({
      _id: session._id,
    });

    return null;
  }

  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.userId),
  });

  if (!user) return null;

  return {
    id: user._id.toString(),
    username: user.username,
  };
}