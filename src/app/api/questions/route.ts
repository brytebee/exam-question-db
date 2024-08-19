import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";
import { Question } from "@prisma/client";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: { exam: true },
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const { questions, examInfo } = await request.json();

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
        },
      });
    }

    await prisma.question.createMany({
      data: questions.map((question: Question) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        imageUrl: question.imageUrl,
        examId: exam.id,
      })),
    });

    return NextResponse.json({ message: "Questions added successfully" });
  } catch (error) {
    return NextResponse.error();
  }
}
