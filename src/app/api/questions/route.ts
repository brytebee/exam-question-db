import { NextResponse } from "next/server";
import { getClient } from "@/app/lib/db";

// GET: Retrieve all questions along with their associated examInfo
export async function GET() {
  const client = await getClient();
  const result = await client.query(`
    SELECT q.id, q.question, q.options, q.correct_answer, q.image_url, e.exam, e.subject, e.year, e.total_questions
    FROM questions q
    JOIN exam_info e ON q.exam_id = e.id
  `);
  return NextResponse.json(result.rows);
}

// POST: Insert a new question with its associated examInfo
export async function POST(request: Request) {
  const { question, options, correctAnswer, imageUrl, examInfo } =
    await request.json();
  const { exam, subject, year, totalQuestions } = examInfo;

  const client = await getClient();

  // Check if the examInfo already exists
  const examResult = await client.query(
    "SELECT id FROM exam_info WHERE exam = $1 AND subject = $2 AND year = $3",
    [exam, subject, year]
  );

  let examId: number;

  if (examResult.rows.length > 0) {
    // If examInfo exists, use the existing id
    examId = examResult.rows[0].id;
  } else {
    // If examInfo does not exist, insert it and get the new id
    const insertExamResult = await client.query(
      "INSERT INTO exam_info (exam, subject, year, total_questions) VALUES ($1, $2, $3, $4) RETURNING id",
      [exam, subject, year, totalQuestions]
    );
    examId = insertExamResult.rows[0].id;
  }

  // Insert the question with the associated exam_id
  await client.query(
    "INSERT INTO questions (question, options, correct_answer, image_url, exam_id) VALUES ($1, $2, $3, $4, $5)",
    [question, options, correctAnswer, imageUrl, examId]
  );

  return NextResponse.json({ message: "Question added successfully" });
}
