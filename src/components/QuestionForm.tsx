// components/QuestionForm.tsx

import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Question, ExamData } from "@/types";

const QuestionForm: React.FC = () => {
  const [exam, setExam] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: uuidv4(),
    questionText: "",
    options: ["", "", "", ""],
    imageUrl: "",
  });

  const handleAddQuestion = () => {
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      id: uuidv4(),
      questionText: "",
      options: ["", "", "", ""],
      imageUrl: "",
    });
  };

  const handleSubmit = async () => {
    const data: ExamData = {
      exam,
      subject,
      year,
      questions,
    };

    await axios.post("/api/saveQuestions", data);
  };

  return (
    <div>
      <h2>Add New Exam Question</h2>
      <input
        type="text"
        value={exam}
        onChange={(e) => setExam(e.target.value)}
        placeholder="Exam (e.g., Waec, Neco)"
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject (e.g., Biology)"
      />
      <input
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year (e.g., 2010)"
      />
      <input
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        placeholder="Total Number of Questions"
      />
      <button onClick={handleAddQuestion}>Enter Questions</button>

      <div>
        <h3>Current Question</h3>
        <textarea
          value={currentQuestion.questionText}
          onChange={(e) =>
            setCurrentQuestion({
              ...currentQuestion,
              questionText: e.target.value,
            })
          }
          placeholder="Question text"
        />
        {currentQuestion.options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...currentQuestion.options];
              newOptions[index] = e.target.value;
              setCurrentQuestion({ ...currentQuestion, options: newOptions });
            }}
            placeholder={`Option ${index + 1}`}
          />
        ))}
        <button
          onClick={() =>
            setCurrentQuestion({
              ...currentQuestion,
              options: [...currentQuestion.options, ""],
            })
          }
        >
          Add Another Option
        </button>
        <input
          type="checkbox"
          checked={!!currentQuestion.imageUrl}
          onChange={(e) =>
            setCurrentQuestion({
              ...currentQuestion,
              imageUrl: e.target.checked ? "" : currentQuestion.imageUrl,
            })
          }
        />
        {currentQuestion.imageUrl && (
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = async () => {
                  // Upload to Cloudinary
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("upload_preset", "your_upload_preset");

                  const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
                    formData
                  );
                  setCurrentQuestion({
                    ...currentQuestion,
                    imageUrl: response.data.secure_url,
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        )}
        <button onClick={handleAddQuestion}>Add Question</button>
      </div>

      {questions.length > 0 && (
        <div>
          <h3>Preview</h3>
          {questions.map((q, index) => (
            <div key={q.id}>
              <h4>Question {index + 1}</h4>
              <p>{q.questionText}</p>
              {q.options.map((option, i) => (
                <p key={i}>{`${String.fromCharCode(65 + i)}. ${option}`}</p>
              ))}
              {q.imageUrl && (
                <img src={q.imageUrl} alt={`Question ${index + 1} Image`} />
              )}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;
