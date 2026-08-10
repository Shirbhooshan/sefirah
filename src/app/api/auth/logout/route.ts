import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST() {
  try {
    const cookieStore = await cookies();

    const sessionToken =
      cookieStore.get("sefirah_session")?.value;

    // Nothing to log out of
    if (!sessionToken) {
      return NextResponse.json({
        success: true,
        message: "Already logged out.",
      });
    }

    const tokenHash = hashToken(sessionToken);

    const client = await clientPromise;
    const db = client.db("sefirah");

    // Delete the session from MongoDB
    await db.collection("sessions").deleteOne({
      tokenHash,
    });

    // Remove cookie from browser
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set({
      name: "sefirah_session",
      value: "",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging out.",
      },
      { status: 500 }
    );
  }
}