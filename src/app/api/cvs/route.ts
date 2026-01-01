import { readdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public/mycv');
    
    let files: string[] = [];
    try {
      files = await readdir(publicDir);
    } catch (error) {
      // Folder doesn't exist yet
      files = [];
    }

    const cvList = files
      .filter(file => file.match(/\.(pdf|doc|docx)$/i))
      .map(file => ({
        name: file,
        url: `/mycv/${file}`,
      }));

    return NextResponse.json({ cvs: cvList });
  } catch (error: any) {
    console.error('Error reading CVs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}