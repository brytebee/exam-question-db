// app/api/saveQuestions/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const filePath = path.join(process.cwd(), "data", "questions.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: "Data saved successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
