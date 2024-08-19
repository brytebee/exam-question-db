-- CreateTable
CREATE TABLE "ExamInfo" (
    "id" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,

    CONSTRAINT "ExamInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER,
    "imageUrl" TEXT,
    "examId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamInfo_exam_subject_year_key" ON "ExamInfo"("exam", "subject", "year");

-- CreateIndex
CREATE INDEX "Question_examId_idx" ON "Question"("examId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "ExamInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
