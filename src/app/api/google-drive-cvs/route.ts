import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listCVsFromDrive } from "@/lib/google-drive";

export async function GET(req: Request) {
  try {
    const session = await auth() as any;
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated. Please sign in again." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    try {
      const files = await listCVsFromDrive(session.accessToken, folderId || undefined);
      return NextResponse.json({ cvs: files });
    } catch (driveError: any) {
      if (driveError.status === 401) {
        return NextResponse.json(
          { error: "Google token expired. Please sign in again.", code: "TOKEN_EXPIRED" },
          { status: 401 }
        );
      }
      if (driveError.status === 403) {
        return NextResponse.json(
          { error: "Permission denied. Check folder access.", code: "PERMISSION_DENIED" },
          { status: 403 }
        );
      }
      if (driveError.status === 404) {
        return NextResponse.json(
          { error: "Folder not found. Check folder ID.", code: "FOLDER_NOT_FOUND" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: driveError.message || "Failed to fetch CVs", details: driveError.errors },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch CVs" },
      { status: 500 }
    );
  }
}


