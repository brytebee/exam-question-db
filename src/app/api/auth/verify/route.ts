import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  // Check if the code matches a token in the database
  const token = await prisma.verificationToken.findUnique({
    where: { token: code },
  });

  if (!token || token.expires < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 }
    );
  }

  // Mark the user as verified
  await prisma.user.update({
    where: { email: token.identifier },
    data: { isVerified: true },
  });

  // Delete the token after verification
  await prisma.verificationToken.delete({
    where: { token: code },
  });

  return NextResponse.json({ message: "Verification successful" });
}

/**
 *
 *  
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
  }

  const token = await prisma.verificationToken.findUnique({ where: { token: code } });

  if (!token || token.expires < new Date()) {
    return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: token.identifier },
    data: { isVerified: true },
  });

  await prisma.verificationToken.delete({ where: { token: code } });

  return NextResponse.json({ success: true }, { status: 200 });
}
 * 
 */
