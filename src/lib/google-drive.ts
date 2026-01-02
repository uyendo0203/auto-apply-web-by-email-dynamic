import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
}

/**
 * Create an authenticated OAuth2Client with access token
 */
function createOAuth2Client(accessToken: string): OAuth2Client {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });
  return oauth2Client;
}

export async function listCVsFromDrive(accessToken: string, folderId?: string): Promise<DriveFile[]> {
  try {
    // Create OAuth2 client with access token
    const oauth2Client = createOAuth2Client(accessToken);

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    // Use provided folder ID or default
    const FOLDER_ID = folderId || "1z7sfz3jRazyk9aVjHfOaVoCslkerjBF3";
    console.log("📁 Fetching CVs from Google Drive folder:", FOLDER_ID);

    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and (mimeType='application/pdf' or mimeType='application/msword' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document')`,
      spaces: "drive",
      pageSize: 50,
      fields: "files(id, name, mimeType, webViewLink, modifiedTime)",
      orderBy: "modifiedTime desc",
    });

    console.log("✅ Found", response.data.files?.length || 0, "CV files");
    return (response.data.files as DriveFile[]) || [];
  } catch (error: any) {
    console.error("❌ Error listing CV files from Google Drive:", error.message);
    if (error.status === 401) {
      console.error("Token expired or invalid. User needs to re-authenticate.");
    }
    throw error;
  }
}

export async function downloadFileAsBuffer(
  fileId: string,
  accessToken: string
): Promise<Buffer> {
  try {
    // Create OAuth2 client with access token
    const oauth2Client = createOAuth2Client(accessToken);

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    console.log("⬇️ Downloading file from Google Drive...");

    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      
      response.data.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      response.data.on("end", () => {
        const buffer = Buffer.concat(chunks);
        console.log("✅ File downloaded successfully, size:", buffer.length, "bytes");
        resolve(buffer);
      });

      response.data.on("error", (error) => {
        console.error("❌ Error downloading file stream:", error.message);
        reject(error);
      });
    });
  } catch (error: any) {
    console.error("❌ Error downloading file from Google Drive:", error.message);
    throw error;
  }
}

export async function downloadFileAsBase64(
  fileId: string,
  accessToken: string
): Promise<string> {
  try {
    const buffer = await downloadFileAsBuffer(fileId, accessToken);
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw error;
  }
}
