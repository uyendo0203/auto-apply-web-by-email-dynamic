import { NextResponse } from 'next/server';
import { sql, SentEmail } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Lấy tổng số bản ghi
    const countResult = await sql`SELECT COUNT(*) as count FROM sent_emails`;
    const count = parseInt(countResult.rows[0]?.count || '0');

    // Lấy dữ liệu phân trang
    const result = await sql`
      SELECT * FROM sent_emails
      ORDER BY sent_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const emails = result.rows as SentEmail[];

    return NextResponse.json({
      emails,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await sql`DELETE FROM sent_emails WHERE id = ${id}`;

    return NextResponse.json({ message: 'Email deleted' });
  } catch (error: any) {
    console.error('❌ Error deleting email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete email' },
      { status: 500 }
    );
  }
}
