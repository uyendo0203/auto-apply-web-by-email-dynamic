import Database from 'better-sqlite3';
import { join } from 'path';
import { mkdirSync } from 'fs';

let db: Database.Database;

export function getDB() {
  if (!db) {
    const dbDir = join(process.cwd(), 'data');
    mkdirSync(dbDir, { recursive: true });
    
    const dbPath = join(dbDir, 'emails.db');
    db = new Database(dbPath);
    
    // Tạo table nếu chưa tồn tại
    db.exec(`
      CREATE TABLE IF NOT EXISTS sent_emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        job_title TEXT NOT NULL,
        contact_name TEXT,
        recipient_email TEXT NOT NULL,
        email_content TEXT NOT NULL,
        cv_filename TEXT,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'success'
      )
    `);
  }
  return db;
}

export interface SentEmail {
  id: number;
  company_name: string;
  job_title: string;
  contact_name: string | null;
  recipient_email: string;
  email_content: string;
  cv_filename: string | null;
  sent_at: string;
  status: string;
}
