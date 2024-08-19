import { getClient } from "./db";

export const migrate = async () => {
  const client = await getClient();

  // Create the exam_info table
  await client.query(`
    CREATE TABLE IF NOT EXISTS exam_info (
      id SERIAL PRIMARY KEY,
      exam TEXT NOT NULL,
      subject TEXT NOT NULL,
      year TEXT NOT NULL,
      total_questions INT NOT NULL,
      UNIQUE (exam, subject, year)
    );
  `);

  // Create the questions table with a foreign key referencing exam_info
  await client.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      options TEXT[] NOT NULL,
      correct_answer INT NOT NULL,
      image_url TEXT,
      exam_id INT NOT NULL,
      FOREIGN KEY (exam_id) REFERENCES exam_info(id) ON DELETE CASCADE
    );
  `);

  console.log("Migration completed");
};
