import { sql } from '@vercel/postgres';

// Initialize the database table if it doesn't exist
export async function initializeDB() {
  try {
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS sent_emails (
        id SERIAL PRIMARY KEY,
        user_email TEXT,
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

    // Add user_email column if it doesn't exist
    try {
      await sql`
        ALTER TABLE sent_emails 
        ADD COLUMN IF NOT EXISTS user_email TEXT;
      `;
    } catch (error) {
      // Column might already exist or other error, continue anyway
      console.log('ℹ️ Column user_email check completed');
    }

    console.log('✅ Database table initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export { sql };

export interface SentEmail {
  id: number;
  user_email: string;
  company_name: string;
  job_title: string;
  contact_name: string | null;
  recipient_email: string;
  email_content: string;
  cv_filename: string | null;
  sent_at: string;
  status: string;
}
