"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestion = exports.getAllQuestions = exports.submitTest = void 0;
const question_model_1 = __importDefault(require("../models/question.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
// Nộp bài test và cập nhật level
exports.submitTest = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { answers } = req.body; // Array of { questionId, selectedOption }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Kiểm tra định dạng câu trả lời
        if (!answers || !Array.isArray(answers)) {
            return next(new ErrorHandler_1.default("Invalid answers format", 400));
        }
        if (answers.length === 0) {
            return next(new ErrorHandler_1.default("No answers provided", 400));
        }
        let correctAnswers = 0;
        // Kiểm tra từng câu trả lời
        for (const answer of answers) {
            // Đảm bảo mỗi câu trả lời chứa questionId và selectedOption
            if (!answer.questionId || !answer.selectedOption) {
                return next(new ErrorHandler_1.default("Missing questionId or selectedOption", 400));
            }
            const question = yield question_model_1.default.findById(answer.questionId);
            if (question) {
                // So sánh câu trả lời đúng
                if (question.correctAnswer === answer.selectedOption) {
                    correctAnswers++;
                }
            }
            else {
                // Nếu câu hỏi không tồn tại, trả lỗi
                return next(new ErrorHandler_1.default(`Question with ID ${answer.questionId} not found`, 404));
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
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        user === null || user === void 0 ? void 0 : user.isTest = true;
        user.level = newLevel;
        yield user.save();
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// Lấy tất cả câu hỏi
exports.getAllQuestions = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Lấy danh sách tất cả câu hỏi từ database
        const questions = yield question_model_1.default.find();
        if (!questions || questions.length === 0) {
            return next(new ErrorHandler_1.default("No questions found", 404));
        }
        res.status(200).json({
            success: true,
            questions,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// Tạo câu hỏi mới
exports.createQuestion = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionText, options, correctAnswer } = req.body;
        // Kiểm tra dữ liệu đầu vào
        if (!questionText || !options || options.length !== 4 || !correctAnswer) {
            return next(new ErrorHandler_1.default("Invalid question data", 400));
        }
        // Kiểm tra xem có đúng 4 lựa chọn không và lựa chọn đúng phải nằm trong các lựa chọn
        if (!options.includes(correctAnswer)) {
            return next(new ErrorHandler_1.default("Correct answer must be one of the options", 400));
        }
        // Tạo câu hỏi mới
        const newQuestion = new question_model_1.default({
            questionText,
            options,
            correctAnswer,
        });
        // Lưu câu hỏi vào cơ sở dữ liệu
        yield newQuestion.save();
        res.status(201).json({
            success: true,
            message: "Question created successfully",
            question: newQuestion,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
