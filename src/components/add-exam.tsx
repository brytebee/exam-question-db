"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";

interface ExamFormState {
  exam: string;
  subject: string;
  year: string;
  totalQuestions: number | "";
}

const AddExamForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<ExamFormState>({
    exam: "",
    subject: "",
    year: "",
    totalQuestions: "",
  });

  // Load saved state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("examInfo");
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setFormState(parsedState);
        } catch (error) {
          console.error("Error parsing saved exam info:", error);
          localStorage.removeItem("examInfo"); // Clear invalid data
        }
      }
    }
  }, []);

  // Save to localStorage whenever form state changes
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      Object.values(formState).some((value) => value !== "")
    ) {
      localStorage.setItem("examInfo", JSON.stringify(formState));
    }
  }, [formState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { id, value, type } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [id]: type === "number" ? (value ? Number(value) : "") : value,
    }));

    // Clear any existing error toasts when user makes corrections
    if (id === "totalQuestions" && Number(value) > 0) {
      toast.dismiss();
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { exam, subject, year, totalQuestions } = formState;

    // Validation
    if (totalQuestions === "" || +totalQuestions < 1) {
      toast.error("Total questions must be greater than 0!");
      return;
    }

    if (exam && subject && year && totalQuestions) {
      setIsSubmitting(true);

      try {
        // Save to localStorage before navigation
        localStorage.setItem("examInfo", JSON.stringify(formState));
        localStorage.removeItem("questions"); // Clear any previous questions

        toast.success("Exam details saved successfully!");
        router.push("/exam/add-questions");
      } catch (error) {
        console.error("Error saving exam info:", error);
        toast.error("Failed to save exam information. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleCancel = () => {
    // If form has data, confirm before leaving
    if (Object.values(formState).some((value) => value !== "")) {
      if (
        confirm(
          "Are you sure you want to cancel? Your changes will not be saved."
        )
      ) {
        localStorage.removeItem("examInfo");
        toast.info("Form data cleared");
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  const examOptions = ["WAEC", "NECO", "JAMB", "GCE"];
  const subjectOptions = [
    "English Language",
    "Mathematics",
    "Biology",
    "Further Mathematics",
    "Economics",
    "Literature",
    "Computer Studies",
    "Library Studies & Reading Culture",
    "Entrepreneurship",
    "Physics",
    "Chemistry",
    "Technical Drawing",
    "Geography",
    "Agricultural Science",
    "French",
    "Food and Nutrition",
    "C.R.Studies",
    "I.R.S.",
    "Government/History",
    "Geography",
    "French",
    "Fine Arts Music",
    "Agricultural Science",
    "Commerce",
    "Financial Accounting",
    "Commerce Agricultural Science",
    "Geography",
    "French",
    "Government",
  ];

  const yearOptions = Array.from({ length: 15 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
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
              Exam <span className="text-red-500">*</span>
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
              Subject <span className="text-red-500">*</span>
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
              Year <span className="text-red-500">*</span>
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
              Total Number of Questions <span className="text-red-500">*</span>
            </label>
            <input
              id="totalQuestions"
              type="number"
              value={formState.totalQuestions}
              onChange={handleChange}
              className="p-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1"
              required
            />
            {formState.totalQuestions !== "" &&
              +formState.totalQuestions < 1 && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a value greater than 0
                </p>
              )}
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 w-1/3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 w-2/3 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : "Enter Questions"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamForm;
