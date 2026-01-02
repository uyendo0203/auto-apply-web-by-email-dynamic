import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sql, initializeDB } from '@/lib/db';
import { appendFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    // 1. KIỂM TRA API KEY TỪ HEADER
    const apiKey = req.headers.get('x-api-key');
    const VALID_API_KEY = process.env.API_KEY;

    if (!apiKey || apiKey !== VALID_API_KEY) {
      return NextResponse.json(
        { error: '❌ API Key không hợp lệ! Truy cập bị từ chối.' },
        { status: 401 }
      );
    }

    const { companyName, jobTitle, contactName, recipientEmail, emailContent, cvFile, cvFileName } = await req.json();

    // 2. GMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 3. CHUẨN BỊ ATTACHMENTS (CV)
    const attachments = [];
    
    if (cvFile) {
      const base64Data = cvFile.split(',')[1] || cvFile;
      const buffer = Buffer.from(base64Data, 'base64');
      
      const mimeType = cvFile.includes('pdf') ? 'application/pdf' : 'application/msword';
      const filename = cvFileName || `Uyen_Do_CV.${mimeType.includes('pdf') ? 'pdf' : 'docx'}`;
      
      attachments.push({
        filename: filename,
        content: buffer,
        contentType: mimeType,
      });
    }

    // 4. NỘI DUNG EMAIL
    const mailOptions = {
      from: `"Uyen Do" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `[Application] ${jobTitle} - Uyen Do`,
      html: emailContent,
      replyTo: process.env.GMAIL_USER,
      attachments: attachments,
    };

    // 5. GỬI EMAIL
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);

    // 6. LƯU VÀO DATABASE
    try {
      await initializeDB();
      
      const result = await sql`
        INSERT INTO sent_emails (company_name, job_title, contact_name, recipient_email, email_content, cv_filename, status)
        VALUES (${companyName}, ${jobTitle}, ${contactName || null}, ${recipientEmail}, ${emailContent}, ${cvFileName || null}, 'success')
        RETURNING id
      `;

      console.log('✅ Email saved to database:', result.rows[0]?.id);

      // 7. LƯU VÀO FILE MARKDOWN
      try {
        const mdFilePath = join(process.cwd(), 'public', 'company-email.md');
        const timestamp = new Date().toLocaleString('vi-VN');
        
        // Tạo header nếu file chưa tồn tại
        let mdContent = '';
        if (!existsSync(mdFilePath)) {
          mdContent = `# 📧 Danh Sách Email Nhà Tuyển Dụng\n\n`;
        }

        // Thêm entry mới
        mdContent += `## ${companyName}\n`;
        mdContent += `- **Email:** ${recipientEmail}\n`;
        mdContent += `- **Vị Trí:** ${jobTitle}\n`;
        mdContent += `- **Người liên hệ:** ${contactName || 'N/A'}\n`;
        mdContent += `- **CV:** ${cvFileName || 'Không có'}\n`;
        mdContent += `- **Ngày gửi:** ${timestamp}\n`;
        mdContent += `\n---\n\n`;

        appendFileSync(mdFilePath, mdContent, 'utf-8');
        console.log(`✅ Markdown file updated: ${mdFilePath}`);
      } catch (mdError) {
        console.error('⚠️ Markdown save error (non-critical):', mdError);
      }

      return NextResponse.json(
        { 
          message: '✅ Email sent successfully', 
          messageId: info.messageId,
          emailId: result.rows[0]?.id
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { message: 'Email sent but database save failed', messageId: info.messageId },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}