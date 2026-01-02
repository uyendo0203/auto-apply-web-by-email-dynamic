import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const FOLDER_ID = "1z7sfz3jRazyk9aVjHfOaVoCslkerjBF3";

function createOAuth2Client(accessToken: string): OAuth2Client {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });
  return oauth2Client;
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 }
      );
    }

    const oauth2Client = createOAuth2Client(session.accessToken);
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    console.log("🗑️ Deleting file from Google Drive:", fileId);

    await drive.files.delete({ fileId });

    console.log("✅ File deleted successfully");

    return NextResponse.json({ success: true, message: "File deleted" });
  } catch (error: any) {
    console.error("Error deleting file:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
