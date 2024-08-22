import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";
import { Question } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const examId = url.searchParams.get("examId");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!examId) {
    return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
  }

  try {
    const [questions, totalQuestions] = await Promise.all([
      prisma.question.findMany({
        where: { examId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.question.count({ where: { examId } }),
    ]);

    return NextResponse.json({
      questions,
      totalPages: Math.ceil(totalQuestions / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { questions, examInfo, userId } = await request.json();

  try {
    let exam = await prisma.examInfo.findUnique({
      where: {
        exam_subject_year: {
          exam: examInfo.exam,
          subject: examInfo.subject,
          year: examInfo.year,
        },
      },
    });

    if (!exam) {
      exam = await prisma.examInfo.create({
        data: {
          exam: examInfo.exam,
          subject: examInfo.subject,
          year: examInfo.year,
          totalQuestions: examInfo.totalQuestions,
          userId, // Associate the exam with the user
        },
      });
    }

    await prisma.question.createMany({
      data: questions.map((question: Question) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        imageUrl: question.imageUrl,
        examId: exam.id, // Associate the question with the exam
      })),
    });

    return NextResponse.json({ message: "Questions added successfully" });
  } catch (error) {
    console.error("Error adding questions:", error);
    return NextResponse.error();
  }
}
