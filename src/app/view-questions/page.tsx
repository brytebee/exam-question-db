"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ExamDets {
  exam: string;
  subject: string;
  year: string;
  [key: string]: unknown;
}

const ViewQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; imageUrl?: string }[]
  >([]);
  const [examDets, setExamDets] = useState<ExamDets | null>(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem("examInfo");
    const examInfo = storedInfo ? JSON.parse(storedInfo) : null;
    if (examInfo && examInfo.totalQuestions) {
      setExamDets(examInfo);
    }
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/006/240/296/small_2x/idyllic-mountain-landscape-with-fresh-green-meadows-and-blooming-wildflowers-idyllic-nature-countryside-view-rural-outdoor-natural-view-idyllic-banner-nature-panoramic-spring-summer-scenery-photo.jpg')",
      }}
    >
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 py-12">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">
          View Questions
        </h1>
        <h2 className="text-3xl font-bold mb-6 text-indigo-800">
          Exam Details{" - "}
          <span className="text-[18px]">
            {examDets?.exam
              ?.slice(0, 1)
              .toUpperCase()
              .concat(examDets.exam.slice(1).toLowerCase())}{" "}
            {examDets?.subject} {examDets?.year}
          </span>
        </h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {questions.map((question, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm"
            >
              <div>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-lg text-gray-700">
                    {index + 1}. {question.question}
                  </p>
                </div>
                {question.imageUrl && (
                  <img
                    src={question.imageUrl}
                    alt="Question Image"
                    className="w-full h-auto mt-3 rounded-lg"
                  />
                )}
                <ol type="a" className="list-decimal pl-5 mt-3 text-gray-700">
                  {question.options.map((option, i) => (
                    <li key={i} className="mt-1">
                      {option}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-4 mt-6">
          <Link
            href="/preview"
            className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 w-full text-center"
          >
            Update
          </Link>
          <Link
            href="/"
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 w-full text-center"
          >
            Submit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewQuestionsPage;
