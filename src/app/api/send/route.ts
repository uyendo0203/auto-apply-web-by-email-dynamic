import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import nodemailer from "nodemailer";
import { sql, initializeDB } from "@/lib/db";
import { downloadFileAsBuffer } from "@/lib/google-drive";

export async function POST(req: Request) {
  try {
    // Kiểm tra session
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "❌ Bạn phải đăng nhập trước" },
        { status: 401 }
      );
    }

    const { companyName, jobTitle, contactName, recipientEmail, emailContent, cvFileId, cvFileName } = await req.json();

    // Validate required fields
    if (!recipientEmail || !emailContent) {
      return NextResponse.json(
        { error: "❌ Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Gmail SMTP config
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: session.user.email,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Prepare attachments
    const attachments: any[] = [];
    
    if (cvFileId && session.accessToken) {
      try {
        console.log(`📥 Downloading CV from Google Drive: ${cvFileName}`);
        
        const fileBuffer = await downloadFileAsBuffer(cvFileId, session.accessToken);
        
        // Get file extension from filename or default to pdf
        const extension = cvFileName?.split('.').pop() || 'pdf';
        const mimeType = getMimeType(extension);

        attachments.push({
          filename: cvFileName || `CV.${extension}`,
          content: fileBuffer,
          contentType: mimeType,
        });

        console.log(`✅ CV downloaded: ${fileBuffer.length} bytes`);
      } catch (error) {
        console.error("❌ Error downloading CV from Drive:", error);
        return NextResponse.json(
          { error: "❌ Lỗi tải CV từ Google Drive" },
          { status: 500 }
        );
      }
    }

    // Send email
    const mailOptions = {
      from: session.user.email,
      to: recipientEmail,
      subject: `[Application] ${jobTitle}`,
      html: emailContent,
      replyTo: session.user.email,
      attachments,
    };

    console.log("📧 Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    // Save to database
    try {
      await initializeDB();

      await sql`
        INSERT INTO sent_emails (
          user_email,
          company_name,
          job_title,
          contact_name,
          recipient_email,
          email_content,
          cv_filename,
          status
        )
        VALUES (
          ${session.user.email},
          ${companyName},
          ${jobTitle},
          ${contactName || null},
          ${recipientEmail},
          ${emailContent},
          ${cvFileName || null},
          'success'
        )
      `;

      console.log("✅ Email saved to database");
    } catch (dbError) {
      console.error("⚠️ Database error:", dbError);
      // Don't fail the whole request if DB fails
    }

    return NextResponse.json(
      {
        message: "✅ Email sent successfully",
        messageId: info.messageId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: error.message || "❌ Failed to send email" },
      { status: 500 }
    );
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    jpg: "image/jpeg",
    png: "image/png",
  };

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}