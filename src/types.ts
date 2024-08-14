// types.ts

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  imageUrl?: string;
}

export interface ExamData {
  exam: string;
  subject: string;
  year: string;
  questions: Question[];
}
