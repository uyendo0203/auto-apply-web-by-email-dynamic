import { sql } from '@vercel/postgres';

// Initialize the database table if it doesn't exist
export async function initializeDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS sent_emails (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        job_title TEXT NOT NULL,
        contact_name TEXT,
        recipient_email TEXT NOT NULL,
        email_content TEXT NOT NULL,
        cv_filename TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'success'
      );
    `;
    console.log('✅ Database table initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export { sql };

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
