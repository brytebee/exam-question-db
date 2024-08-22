"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import XBtn from "/public/x-btn.png";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ExamDets {
  exam: string;
  subject: string;
  year: string;
  totalQuestions: number;
}

const PreviewQuestions: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<
    {
      question: string;
      options: string[];
      correctAnswer?: number;
      imageUrl?: string;
    }[]
  >([]);
  const [editableQuestion, setEditableQuestion] = useState<number | null>(null);
  const [examDets, setExamDets] = useState<ExamDets | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      const storedInfo = localStorage.getItem("examInfo");
      const examInfo = storedInfo ? JSON.parse(storedInfo) : null;
      if (examInfo && examInfo.totalQuestions) {
        setExamDets(examInfo);
      }
      const storedQuestions = localStorage.getItem("questions");
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      }
    }
  }, [status, router]);

  const handleEdit = (index: number) => {
    setEditableQuestion(index);
  };

  const handleSave = () => {
    if (editableQuestion !== null) {
      setEditableQuestion(null);
      localStorage.setItem("questions", JSON.stringify(questions));
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options.length < 6) {
      updatedQuestions[questionIndex].options.push("");
      setQuestions(updatedQuestions);
    }
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    optionIndex: number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (!examDets) {
      toast.error("Exam details are missing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          examInfo: examDets,
          // @ts-ignore
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save questions.");
      }

      const result = await response.json();
      toast.success(result.message || "Questions saved successfully.");

      localStorage.removeItem("questions");
      localStorage.removeItem("examInfo");

      router.push("/exam/view-exams");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/006/240/296/small_2x/idyllic-mountain-landscape-with-fresh-green-meadows-and-blooming-wildflowers-idyllic-nature-countryside-view-rural-outdoor-natural-view-idyllic-banner-nature-panoramic-spring-summer-scenery-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 py-12">
        <h2 className="text-3xl font-bold mb-6 text-indigo-800">
          Preview Questions{" - "}
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
              className={`${
                editableQuestion === index && "border-yellow-500 border-2"
              } border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm`}
            >
              {editableQuestion === index ? (
                <div>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-3 text-black"
                    rows={4}
                  />
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`flex items-center mb-2 ${
                        question.correctAnswer === optionIndex
                          ? "border-2 border-green-500 bg-green-100"
                          : ""
                      }`}
                    >
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optionIndex, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded p-2 text-black"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCorrectAnswerChange(index, optionIndex)
                        }
                        className="ml-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                      >
                        Mark Correct
                      </button>
                      {question.options.length > 4 && (
                        <Image
                          src={XBtn}
                          alt="Remove option"
                          width={24}
                          height={24}
                          onClick={() => handleRemoveOption(index, optionIndex)}
                          className="ml-2 cursor-pointer"
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end gap-6">
                    {question.options.length < 6 && (
                      <button
                        onClick={() => handleAddOption(index)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                        Add Option
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600 px-3"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-lg text-gray-700">
                      {index + 1}. {question.question}
                    </p>
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
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
                      <li
                        key={i}
                        className={`mt-1 ${
                          question.correctAnswer === i
                            ? "border-l-4 border-b-2 border-green-500 bg-green-50"
                            : ""
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className={`bg-indigo-600 text-white p-3 rounded-lg mt-6 hover:bg-indigo-700 w-full ${
            isSubmitting || editableQuestion !== null
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={editableQuestion !== null || isSubmitting} // Disable button if no question is being edited or if submitting
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-3 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3.29a5 5 0 00-4 4.71H4z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default PreviewQuestions;
