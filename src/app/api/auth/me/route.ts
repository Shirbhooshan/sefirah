import { NextResponse } from "next/server";
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

export async function GET() {
    try {
        const cookieStore = await cookies();

        const sessionToken =
            cookieStore.get("sefirah_session")?.value;

        // No session
        if (!sessionToken) {
            return NextResponse.json(
                {
                    success: false,
                    authenticated: false,
                    message: "Not authenticated.",
                },
                { status: 401 }
            );
        }

        const tokenHash = hashToken(sessionToken);

        const client = await clientPromise;
        const db = client.db("sefirah");

        const session = await db.collection("sessions").findOne({
            tokenHash,
        });

        // Session doesn't exist
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    authenticated: false,
                    message: "Invalid session.",
                },
                { status: 401 }
            );
        }

        // Session expired
        if (session.expiresAt < new Date()) {
            await db.collection("sessions").deleteOne({
                _id: session._id,
            });

            return NextResponse.json(
                {
                    success: false,
                    authenticated: false,
                    message: "Session expired.",
                },
                { status: 401 }
            );
        }

        const user = await db.collection("users").findOne({
            _id: new ObjectId(session.userId),
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    authenticated: false,
                    message: "User not found.",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            authenticated: true,
            user: {
                id: user._id.toString(),
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Session verification error:", error);

        return NextResponse.json(
            {
                success: false,
                authenticated: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}