"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    questionText: {
        type: String,
        required: [true, "Question text is required"],
    },
    options: [
        {
            type: String,
            required: [true, "Each option is required"],
        },
    ],
    correctAnswer: {
        type: String,
        required: [true, "Correct answer is required"],
    },
}, { timestamps: true });
const QuestionModel = mongoose_1.default.model("Question", questionSchema);
exports.default = QuestionModel;
