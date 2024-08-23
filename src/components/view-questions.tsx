"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/commons/Spinner-mui";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  imageUrl?: string;
}

interface ViewQuestProps {
  examId: string;
}

const ViewQuestions = ({ examId }: ViewQuestProps) => {
  const { data: _, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      setLoading(true);

      (async () => await fetchQuestions())();
    }
  }, [currentPage]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `/api/questions?page=${currentPage}&examId=${examId}`
      );
      const data = await response.json();
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error fetching questions!");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = () => (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 mr-2 min-w-24"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 ml-2 min-w-24"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      {loading && <Spinner text="Loading questions!" />}

      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8 py-12 relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">Questions</h1>

        {questions?.length > 0 ? (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {questions.map((question) => (
              <div
                key={question.id}
                className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="font-medium text-lg text-gray-700">
                  {question.question}
                </p>
                {question.imageUrl && (
                  <img src={question.imageUrl} alt="Question image" />
                )}
                <ul className="mt-2 space-y-2">
                  {question.options.map((option, index) => (
                    <li
                      key={index}
                      className={`p-2 rounded-lg text-gray-700 ${
                        question.correctAnswer === index
                          ? "bg-green-100"
                          : "bg-white"
                      }`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl text-red-600 mb-6">
            No questions available for this exam.
          </p>
        )}

        {renderPagination()}

        <div className="mt-6">
          <button
            onClick={() => router.push("/exam/view-exams")}
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 w-full text-center block"
          >
            Back to Exams
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuestions;
