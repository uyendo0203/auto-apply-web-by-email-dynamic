import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listCVsFromDrive } from "@/lib/google-drive";

export async function GET(req: Request) {
  try {
    const session = await auth();
    console.log("Session:", session?.user?.email);

    if (!session?.accessToken) {
      console.error("No access token found");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get folder ID from query params or use default
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    console.log("Fetching CVs from Google Drive...");
    const files = await listCVsFromDrive(session.accessToken, folderId || undefined);
    console.log("CVs found:", files.length);

    return NextResponse.json({ cvs: files });
  } catch (error: any) {
    console.error("Error fetching CVs:", error);
    console.error("Error details:", error.message, error.errors);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CVs", details: error.errors },
      { status: 500 }
    );
  }
}


