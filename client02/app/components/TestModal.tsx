import React, { useEffect, useState } from "react";
import { useGetAllQuestionsQuery } from "../../redux/features/question/questionApi";
import { useLoadUserQuery, useSubmitTestMutation } from "../../redux/features/api/apiSilce";
import { Style } from "../../app/style/styleTest"; // Import Style
import  {incrementCount}  from "@/redux/features/auth/authSilce";
import { useDispatch, useSelector } from "react-redux";

interface TestModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onTestCompleted: () => void;
  refetch?: any;
  count: number;
  setCount: (value: number) => void;
  user:any
}

const TestModal: React.FC<TestModalProps> = ({
  open,
  setOpen,
  onTestCompleted,
  count,
  setCount,
  user
}) => {
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useGetAllQuestionsQuery(undefined, {
    skip: !open, // Only fetch questions if modal is open
  });
  const [submitTest, { isSuccess, isLoading: isSubmitting, error }] =
    useSubmitTestMutation();

  useEffect(() => {
    if (isSuccess) {
      refetch().then((res) => {
        console.log("Refetch result:", res);
      });
      setOpen(false);
    }
  }, [isSuccess, error, refetch]);

  const questions = Array.isArray(data?.questions) ? data?.questions : [];
  const [answers, setAnswers] = useState<{ [key: string]: string }>({}); // Store answers with questionId as key
  const [currentPage, setCurrentPage] = useState(0); // Track current page

  // Check if all questions are answered
  const allAnswered = Object.keys(answers).length === questions.length;

  // Handle answer change
  const handleAnswerChange = (questionId: string, option: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  // Handle test submission
  const handleSubmit = async () => {
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedOption: answers[questionId],
    }));

    try {
      const result = await submitTest({ answers: formattedAnswers }).unwrap();
      dispatch(incrementCount());

      refetch();    
      setOpen(false);
      setCount(1); // Cập nhật số lần nộp bài
    } catch (err) {
      console.error("Failed to submit test:", err);
    }
  };

  // Navigation between questions
  const goToNextPage = () => {
    if (currentPage < questions.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!open) return null;

  return (
    <div className={Style.modalOverlay}>
      <div className={Style.modalContent}>
        <h2 className={Style.modalHeader}>Complete the Test</h2>
        {isLoading ? (
          <p>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          <div className={Style.questionContainer}>
            <p className={Style.questionText}>
              {questions[currentPage].questionText}
            </p>
            <div className={Style.optionsContainer}>
              {questions[currentPage].options.map((option: any, idx: any) => (
                <div key={idx} className={Style.optionItem}>
                  <input
                    type="radio"
                    id={`question-${questions[currentPage]._id}-option-${idx}`}
                    name={`question-${questions[currentPage]._id}`}
                    value={option}
                    checked={answers[questions[currentPage]._id] === option}
                    onChange={() =>
                      handleAnswerChange(questions[currentPage]._id, option)
                    }
                    className={Style.radioInput}
                  />
                  <label
                    htmlFor={`question-${questions[currentPage]._id}-option-${idx}`}
                    className={Style.label}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={Style.buttonsContainer}>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`${Style.submitButton} ${
              currentPage === 0 ? Style.disabledButton : ""
            }`}
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === questions.length - 1}
            className={`${Style.submitButton} ${
              currentPage === questions.length - 1 ? Style.disabledButton : ""
            }`}
          >
            Next
          </button>
        </div>

        <div className={Style.pageNavigation}>
          Page {currentPage + 1} of {questions.length}
        </div>

        <div className={Style.buttonsContainer}>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting || currentPage < questions.length - 1 || !allAnswered
            }
            className={`${Style.submitButton} ${
              isSubmitting || currentPage < questions.length - 1 || !allAnswered
                ? Style.disabledButton
                : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestModal;
