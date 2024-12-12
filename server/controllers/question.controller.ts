import { Request, Response, NextFunction } from "express";
import QuestionModel from "../models/question.model";
import UserModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";


// Nộp bài test và cập nhật level
export const submitTest = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answers } = req.body; // Array of { questionId, selectedOption }
        const userId = req.user?._id;
        
        // Kiểm tra định dạng câu trả lời
        if (!answers || !Array.isArray(answers)) {
            return next(new ErrorHandler("Invalid answers format", 400));
        }

        if (answers.length === 0) {
            return next(new ErrorHandler("No answers provided", 400));
        }

        let correctAnswers = 0;

        // Kiểm tra từng câu trả lời
        for (const answer of answers) {
            // Đảm bảo mỗi câu trả lời chứa questionId và selectedOption
            if (!answer.questionId || !answer.selectedOption) {
                return next(new ErrorHandler("Missing questionId or selectedOption", 400));
            }

            const question = await QuestionModel.findById(answer.questionId);
            if (question) {
                // So sánh câu trả lời đúng
                if (question.correctAnswer === answer.selectedOption) {
                    correctAnswers++;
                }
            } else {
                // Nếu câu hỏi không tồn tại, trả lỗi
                return next(new ErrorHandler(`Question with ID ${answer.questionId} not found`, 404));
            }
        }

        // Tính điểm
        const totalQuestions = answers.length;
        const score = (correctAnswers / totalQuestions) * 100;

        // Cập nhật level dựa trên điểm số
        let newLevel = "Beginner"; // Mặc định là Beginner
        if (score >= 80) {
            newLevel = "Intermediate";
        }
        if (score >= 90) {
            newLevel = "Advanced";
        }

        // Cập nhật level người dùng
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }        
        user?.isTest = true;
        user.level = newLevel;
        await user.save();
        
        // Trả về kết quả
        res.status(200).json({
            success: true,
            message: "Test submitted successfully",
            score,
            correctAnswers,
            totalQuestions,
            newLevel,
            user
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});





// Lấy tất cả câu hỏi
export const getAllQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Lấy danh sách tất cả câu hỏi từ database
        const questions = await QuestionModel.find();

        if (!questions || questions.length === 0) {
            return next(new ErrorHandler("No questions found", 404));
        }

        res.status(200).json({
            success: true,
            questions,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



// Tạo câu hỏi mới
export const createQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { questionText, options, correctAnswer } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!questionText || !options || options.length !== 4 || !correctAnswer) {
            return next(new ErrorHandler("Invalid question data", 400));
        }

        // Kiểm tra xem có đúng 4 lựa chọn không và lựa chọn đúng phải nằm trong các lựa chọn
        if (!options.includes(correctAnswer)) {
            return next(new ErrorHandler("Correct answer must be one of the options", 400));
        }

        // Tạo câu hỏi mới
        const newQuestion = new QuestionModel({
            questionText,
            options,
            correctAnswer,
        });

        // Lưu câu hỏi vào cơ sở dữ liệu
        await newQuestion.save();

        res.status(201).json({
            success: true,
            message: "Question created successfully",
            question: newQuestion,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
