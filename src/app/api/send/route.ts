import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { companyName, jobTitle, contactName, recipientEmail, passcode, emailContent, cvFile, cvFileName } = await req.json();

    // 1. KIỂM TRA PASSCODE ĐỂ BẢO MẬT
    const APP_SECRET = process.env.SECRET_PASSCODE;
    if (!passcode || passcode !== APP_SECRET) {
      return NextResponse.json(
        { error: 'Mã xác thực (Passcode) không đúng!' }, 
        { status: 401 }
      );
    }

    // 2. LOGIC TỰ ĐỘNG CHUYỂN ĐỔI (SWITCH) GIỮA LOCAL VÀ PRODUCTION
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let transporterConfig;

    if (isDevelopment) {
      // Cấu hình Mailtrap khi chạy localhost
      console.log("🚀 Chế độ TEST: Đang sử dụng Mailtrap");
      transporterConfig = {
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      };
    } else {
      // Cấu hình Gmail khi đã deploy lên Vercel
      console.log("🌍 Chế độ PRODUCTION: Đang sử dụng Gmail");
      transporterConfig = {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      };
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    // 3. CHUẨN BỊ ATTACHMENTS (CV)
    const attachments = [];
    
    if (cvFile) {
      // Convert base64 to buffer
      const base64Data = cvFile.split(',')[1] || cvFile;
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Xác định loại file từ cvFile header
      const mimeType = cvFile.includes('pdf') ? 'application/pdf' : 'application/msword';
      const filename = cvFileName || `Uyen_Do_CV.${mimeType.includes('pdf') ? 'pdf' : 'docx'}`;
      
      attachments.push({
        filename: filename,
        content: buffer,
        contentType: mimeType,
      });
    }

    // 4. NỘI DUNG EMAIL ỨNG TUYỂN
    const mailOptions = {
      from: `"Uyen Do" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `[Application] ${jobTitle} - Uyen Do`,
      html: emailContent,
      replyTo: process.env.GMAIL_USER,
      attachments: attachments, // Đính kèm CV
    };

    // 5. GỬI EMAIL
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);

    return NextResponse.json(
      { message: 'Email sent successfully', messageId: info.messageId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}