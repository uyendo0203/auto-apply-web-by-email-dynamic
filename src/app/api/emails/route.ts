import { NextResponse } from 'next/server';
import { getDB, SentEmail } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const db = getDB();
    
    // Lấy tổng số bản ghi
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM sent_emails');
    const { count } = countStmt.get() as { count: number };

    // Lấy dữ liệu phân trang
    const stmt = db.prepare(`
      SELECT * FROM sent_emails
      ORDER BY sent_at DESC
      LIMIT ? OFFSET ?
    `);
    const emails = stmt.all(limit, offset) as SentEmail[];

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

    const db = getDB();
    const stmt = db.prepare('DELETE FROM sent_emails WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ message: 'Email deleted' });
  } catch (error: any) {
    console.error('❌ Error deleting email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete email' },
      { status: 500 }
    );
  }
}
