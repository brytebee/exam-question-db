"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

interface ExamFormState {
  exam: string;
  subject: string;
  year: string;
  totalQuestions: number | "";
}

const AddExamForm: React.FC = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<ExamFormState>(() => {
    const savedState = localStorage.getItem("examInfo");
    return savedState
      ? JSON.parse(savedState)
      : { exam: "", subject: "", year: "", totalQuestions: "" };
  });

  useEffect(() => {
    localStorage.setItem("examInfo", JSON.stringify(formState));
  }, [formState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { id, value, type } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { exam, subject, year, totalQuestions } = formState;
    if (exam && subject && year && totalQuestions) {
      router.push("/add-questions");
    }
  };

  const examOptions = ["WAEC", "NECO", "JAMB", "GCE"];
  const subjectOptions = ["Mathematics", "English", "Physics", "Chemistry"];
  const yearOptions = Array.from({ length: 20 }, (_, i) =>
    (2000 + i).toString()
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
      style={{
        backgroundImage:
          "url('https://forwardtogether.org/wp-content/uploads/2016/01/college-students.jpg')",
      }}
    >
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-indigo-800">
          Add New Exam Question
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="exam" className="font-medium mb-2 text-gray-700">
              Exam
            </label>
            <select
              id="exam"
              value={formState.exam}
              onChange={handleChange}
              className="p-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select an exam
              </option>
              {examOptions.map((examOption) => (
                <option key={examOption} value={examOption}>
                  {examOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="subject" className="font-medium mb-2 text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              value={formState.subject}
              onChange={handleChange}
              className="p-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select a subject
              </option>
              {subjectOptions.map((subjectOption) => (
                <option key={subjectOption} value={subjectOption}>
                  {subjectOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="year" className="font-medium mb-2 text-gray-700">
              Year
            </label>
            <select
              id="year"
              value={formState.year}
              onChange={handleChange}
              className="p-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select a year
              </option>
              {yearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="totalQuestions"
              className="font-medium mb-2 text-gray-700"
            >
              Total Number of Questions
            </label>
            <input
              id="totalQuestions"
              type="number"
              value={formState.totalQuestions}
              onChange={handleChange}
              className="p-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
          >
            Enter Questions
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExamForm;
