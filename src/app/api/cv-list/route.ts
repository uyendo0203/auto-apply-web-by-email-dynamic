import { NextResponse } from 'next/server';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const cvDir = join(process.cwd(), 'public/mycv');
    
    let files: string[] = [];
    try {
      files = await readdir(cvDir);
    } catch (error) {
      files = [];
    }

    const cvList = files
      .filter(file => file.match(/\.(pdf|doc|docx)$/i))
      .map(file => ({
        name: file,
        url: `/mycv/${file}`,
        uploadedAt: new Date().toLocaleString('vi-VN'),
      }));

    return NextResponse.json({ cvs: cvList });
  } catch (error: any) {
    console.error('Error reading CVs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }

    const cvPath = join(process.cwd(), 'public/mycv', filename);
    
    // Validate filename to prevent directory traversal
    if (!cvPath.startsWith(join(process.cwd(), 'public/mycv'))) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    await unlink(cvPath);

    return NextResponse.json({ message: 'CV deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete CV' },
      { status: 500 }
    );
  }
}
