import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { writeFileSync } from 'fs';
import { join } from 'path';
import ExcelJS from 'exceljs';

export async function POST(req: Request) {
  try {
    // Lấy tất cả email nhà tuyển dụng (recipient_email)
    const result = await sql`
      SELECT DISTINCT recipient_email, company_name, job_title
      FROM sent_emails
      ORDER BY company_name ASC
    `;
    
    const emails = result.rows as Array<{
      recipient_email: string;
      company_name: string;
      job_title: string;
    }>;

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'Không có email nào để xuất' },
        { status: 400 }
      );
    }

    // Tạo workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách Email');

    // Thiết lập header
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Email Nhà Tuyển Dụng', key: 'recipient_email', width: 30 },
      { header: 'Công Ty', key: 'company_name', width: 25 },
      { header: 'Vị Trí', key: 'job_title', width: 25 },
    ];

    // Style header
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 12,
    };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

    // Thêm dữ liệu
    emails.forEach((email, index) => {
      const row = worksheet.addRow({
        stt: index + 1,
        recipient_email: email.recipient_email,
        company_name: email.company_name,
        job_title: email.job_title,
      });

      // Style dữ liệu
      row.font = { size: 11 };
      row.alignment = { horizontal: 'left', vertical: 'middle' };
      
      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' },
        };
      }
    });

    // Lưu file Excel
    const filePath = join(process.cwd(), 'public', 'company-email.xlsx');
    await workbook.xlsx.writeFile(filePath);

    return NextResponse.json({
      success: true,
      message: `✅ Đã lưu ${emails.length} email vào public/company-email.xlsx`,
      count: emails.length,
      fileUrl: '/company-email.xlsx',
    });
  } catch (error: any) {
    console.error('❌ Error exporting emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export emails' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Lấy tất cả email nhà tuyển dụng
    const result = await sql`
      SELECT DISTINCT recipient_email, company_name, job_title
      FROM sent_emails
      ORDER BY company_name ASC
    `;
    
    const emails = result.rows as Array<{
      recipient_email: string;
      company_name: string;
      job_title: string;
    }>;

    return NextResponse.json({
      emails: emails,
      count: emails.length,
    });
  } catch (error: any) {
    console.error('❌ Error fetching emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}