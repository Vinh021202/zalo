import mongoose, { Document, Schema, Model } from "mongoose";

export interface IQuestion extends Document {
  questionText: string;
  options: Array<string>; // List of possible answers
  correctAnswer: string; // The correct answer
}

const questionSchema: Schema<IQuestion> = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const QuestionModel: Model<IQuestion> = mongoose.model("Question", questionSchema);
export default QuestionModel;