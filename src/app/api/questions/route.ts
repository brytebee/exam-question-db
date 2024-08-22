import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";
import { Question } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const examId = req.query.examId as string;
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!examId) {
    return res.status(400).json({ error: "Exam ID is required" });
  }

  try {
    const [questions, totalQuestions] = await Promise.all([
      prisma.examInfo.findMany({
        // @ts-ignore
        where: { userId: session?.user?.id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.question.count({ where: { examId } }),
    ]);

    return res.status(200).json({
      questions,
      totalPages: Math.ceil(totalQuestions / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
