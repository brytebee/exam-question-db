import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import prisma from "@/app/lib/prismaClient";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Generate a verification token
  const verificationToken = randomBytes(3).toString("hex").toUpperCase();
  const expirationTime = addMinutes(new Date(), 30); // Token valid for 30 minutes

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: verificationToken,
      expires: expirationTime,
    },
  });

  // Send verification email
  const EMAIL_LINK = process.env.EMAIL_ENDPOINT?.toString();
  const from = process.env.DOMAIN?.toString();
  const product = process.env.PRODUCT?.toString();

  if (!EMAIL_LINK || !from || !product) {
    return NextResponse.json(
      { message: "Dev: Provide mailing credentials!" },
      { status: 400 }
    );
  }

  const payload = {
    from,
    to: [email],
    subject: "Confirm your account",
    firstName: name,
    code: verificationToken,
    product,
  };

  await fetch(EMAIL_LINK as string, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return NextResponse.json(
    {
      message:
        "Registration successful! Please check your email to verify your account.",
    },
    { status: 200 }
  );
}
