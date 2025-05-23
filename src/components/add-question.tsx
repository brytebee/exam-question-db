"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import XBtn from "/public/x-btn.png";
import { toast } from "react-toastify";

const QuestionForm: React.FC = () => {
  const [questions, setQuestions] = useState<
    {
      question: string;
      options: string[];
      correctAnswer: number | null;
      imageUrl?: string;
    }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: null,
    imageUrl: "",
  });
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  // Add a separate useEffect to handle navigation
  useEffect(() => {
    if (totalQuestions !== null && questions.length >= totalQuestions) {
      router.push("/exam/preview");
    }
  }, [questions.length, totalQuestions, router]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
        );
        formData.append(
          "cloud_name",
          process.env.NEXT_PUBLIC_CLOUD_NAME as string
        );

        // Upload to Cloudinary
        const res = await fetch(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL as string,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await res.json();
        const { secure_url, original_filename, format } = data;

        setFileName(`${original_filename?.slice(0, 10)}...${format}`);
        setUploadedFileName(secure_url);
        setCurrentQuestion((prev) => ({ ...prev, imageUrl: secure_url }));
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setFileName(null);
    setCurrentQuestion((prev) => ({ ...prev, imageUrl: "" }));
    // Clear the file input value to reset the file picker
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const validateQuestion = () => {
    // Check if question is empty
    if (!currentQuestion.question.trim()) {
      toast.error("Please enter a question.");
      return false;
    }

    // Check if all options have content
    if (!currentQuestion.options.every((option) => option.trim())) {
      toast.error("Please fill in all options.");
      return false;
    }

    // Check if a correct answer is selected
    if (correctAnswer === null) {
      toast.error("Please select the correct answer.");
      return false;
    }

    return true;
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateQuestion()) return;

    const updatedQuestions = [
      ...questions,
      { ...currentQuestion, correctAnswer },
    ];
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));

    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      imageUrl: "",
    });
    setUploadedFileName(null);
    setFileName(null);
    setCorrectAnswer(null);
    setShowFileInput(false);
  };

  const isLastQuestion =
    totalQuestions !== null && questions.length + 1 === totalQuestions;

  const handlePreview = () => {
    if (!validateQuestion()) return;

    const updatedQuestions = [
      ...questions,
      { ...currentQuestion, correctAnswer },
    ];
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    router.push("/exam/preview");
  };

  const handleCancel = () => {
    // Show confirmation dialog
    if (questions.length > 0 || currentQuestion.question.trim()) {
      if (
        confirm("Are you sure you want to cancel? Your progress will be lost.")
      ) {
        router.push("/");
      }
    } else {
      router.push("/");
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
        <p className="mb-4 text-gray-600">
          Question {questions.length + 1}{" "}
          {totalQuestions !== null ? `of ${totalQuestions}` : ""}
        </p>
        <form onSubmit={handleAddQuestion} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="question"
              className="font-medium mb-2 text-gray-700"
            >
              Question
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
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === index}
                  onChange={() => setCorrectAnswer(index)}
                  className="ml-2"
                />
                {index === currentQuestion.options.length - 1 &&
                  currentQuestion.options.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="ml-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                      Add Option
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
                checked={showFileInput}
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
                {isUploading ? (
                  <span className="text-gray-700">Uploading...</span>
                ) : uploadedFileName ? (
                  <div className="flex items-center space-x-4">
                    <div>
                      <Image
                        src={uploadedFileName}
                        alt="question sketch"
                        width={100}
                        height={100}
                      />
                    </div>
                    <span className="text-gray-700">{fileName}</span>
                    <Image
                      src={XBtn}
                      alt="cancel"
                      width={20}
                      height={20}
                      onClick={handleRemoveFile}
                      className="ml-2 cursor-pointer"
                    />
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

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={handlePreview}
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 flex-grow"
              >
                Preview
              </button>
            ) : (
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 flex-grow"
              >
                Next Question
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
