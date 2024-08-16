"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import XBtn from "../../../public/x-btn.png";

const QuestionForm: React.FC = () => {
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; imageUrl?: string }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    imageUrl: "",
  });
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedInfo = localStorage.getItem("examInfo");
    const examInfo = storedInfo ? JSON.parse(storedInfo) : null;
    if (examInfo && examInfo.totalQuestions) {
      setTotalQuestions(parseInt(examInfo.totalQuestions, 10));
    }

    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  const handleAddOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleChangeOption = (index: number, value: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      // Assuming you have an upload function that returns the URL
      // const url = await uploadImage(file);
      // setCurrentQuestion((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    // Clear the file input value to reset the file picker
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuestions = [...questions, currentQuestion];
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));

    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      imageUrl: "",
    });
    setUploadedFileName(null);
  };

  const isLastQuestion =
    totalQuestions !== null && questions.length + 1 === totalQuestions;

  const handlePreview = () => {
    if (
      currentQuestion.question.trim() &&
      currentQuestion.options.every((option) => option.trim())
    ) {
      const updatedQuestions = [...questions, currentQuestion];
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
      router.push("/preview");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/006/240/296/small_2x/idyllic-mountain-landscape-with-fresh-green-meadows-and-blooming-wildflowers-idyllic-nature-countryside-view-rural-outdoor-natural-view-idyllic-banner-nature-panoramic-spring-summer-scenery-photo.jpg')",
      }}
    >
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-indigo-800">
          Enter Questions
        </h2>
        <form onSubmit={handleAddQuestion} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="question"
              className="font-medium mb-2 text-gray-700"
            >
              Question {questions.length + 1}
            </label>
            <textarea
              id="question"
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              className="p-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Options</label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleChangeOption(index, e.target.value)}
                  className="p-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg w-full"
                  required
                />
                {index === currentQuestion.options.length - 1 &&
                  currentQuestion.options.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="ml-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                      Add Another Option
                    </button>
                  )}
                {currentQuestion.options.length > 4 && (
                  <Image
                    src={XBtn}
                    alt="cancel"
                    width={30}
                    height={30}
                    onClick={() => handleRemoveOption(index)}
                    className="ml-2 cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex max-h-10 justify-between">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="includeImage"
                className="mr-3"
                onChange={(e) => setShowFileInput(e.target.checked)}
              />
              <label
                htmlFor="includeImage"
                className="font-medium text-gray-700"
              >
                Include Image
              </label>
            </div>

            {showFileInput && (
              <div className="flex items-center mb-4 space-x-5">
                {uploadedFileName ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">{uploadedFileName}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="p-2 border border-gray-300 rounded-lg"
                    onChange={handleFileChange}
                  />
                )}
              </div>
            )}
          </div>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handlePreview}
              className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
            >
              Preview
            </button>
          ) : (
            <button
              type="submit"
              className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
            >
              Next Question
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
