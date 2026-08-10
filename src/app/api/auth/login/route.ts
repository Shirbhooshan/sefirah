import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const username = body.username?.trim().toLowerCase();
        const password = body.password;

        if (!username || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username and password are required.",
                },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("sefirah");
        const users = db.collection("users");

        // Find the user
        const user = await users.findOne({
            username,
        });

        // Don't reveal whether the username exists
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid username or password.",
                },
                { status: 401 }
            );
        }

        // Compare entered password with bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid username or password.",
                },
                { status: 401 }
            );
        }

        const { token, expiresAt } = await createSession(
            user._id.toString()
        );

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id.toString(),
                username: user.username,
            },
        });

        response.cookies.set({
            name: "sefirah_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: expiresAt,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while logging in.",
            },
            { status: 500 }
        );
    }
}