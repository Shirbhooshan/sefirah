import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("SefirahDB");

    // Ping the database to verify the connection
    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB Atlas!",
    });
  } catch (error: any) {
    console.error("MongoDB Connection Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to database",
      },
      { status: 500 }
    );
  }
}