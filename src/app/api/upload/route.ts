import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Đọc file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Lưu vào public/mycv/
    const publicDir = join(process.cwd(), 'public/mycv');
    
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (error) {
      console.log('Directory already exists or cannot be created');
    }

    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filepath = join(publicDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      filename: filename,
      url: `/mycv/${filename}`,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}