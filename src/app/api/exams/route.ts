// import { NextResponse } from "next/server";
// import prisma from "@/app/lib/prismaClient";
// import { NextApiRequest, NextApiResponse } from "next";

// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   const userId = req.query.userId as string;
//   const page = parseInt((req.query.page as string) || "1", 10);
//   const limit = 10;
//   const skip = (page - 1) * limit;

//   if (!userId) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const [exams, totalExams] = await Promise.all([
//       prisma.examInfo.findMany({
//         where: { userId },
//         skip,
//         take: limit,
//         orderBy: { createdAt: "desc" },
//       }),
//       prisma.examInfo.count({ where: { userId } }),
//     ]);

//     return res.status(200).json({
//       exams,
//       totalPages: Math.ceil(totalExams / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error("Error fetching exams:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [exams, totalExams] = await Promise.all([
      prisma.examInfo.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.examInfo.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      exams,
      totalPages: Math.ceil(totalExams / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
