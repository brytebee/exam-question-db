import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const role = url.searchParams.get("role");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!userId || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const queryOptions = {
      skip,
      take: limit,
      orderBy: { createdAt: "desc" } as const,
    };

    let exams, totalExams;

    if (role.toLowerCase() === "admin") {
      [exams, totalExams] = await Promise.all([
        prisma.examInfo.findMany(queryOptions),
        prisma.examInfo.count(),
      ]);
    } else {
      [exams, totalExams] = await Promise.all([
        prisma.examInfo.findMany({
          ...queryOptions,
          where: { userId },
        }),
        prisma.examInfo.count({ where: { userId } }),
      ]);
    }

    return NextResponse.json({
      exams,
      totalPages: Math.ceil(totalExams / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
