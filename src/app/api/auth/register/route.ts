import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = body.username?.trim();
    const password = body.password?.trim();
    const confirmPassword = body.confirmPassword?.trim();

    // Basic validation
    if (!username || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // Password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    // Basic username validation
    if (username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Username must be at least 3 characters long.",
        },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("sefirah");

    const users = db.collection("users");

    // Check whether username already exists
    const existingUser = await users.findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await users.insertOne({
      username: username.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the account.",
      },
      { status: 500 }
    );
  }
}