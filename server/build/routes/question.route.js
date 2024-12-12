"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("../controllers/question.controller");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const questionRouter = express_1.default.Router();
// Route to get questions for a test
questionRouter.get("/get-all-questions", user_controller_1.updateAccessToken, auth_1.isAutheticated, (0, auth_1.authorizaRoles)("user"), question_controller_1.getAllQuestions);
// Route to submit test answers
questionRouter.put("/submit-test", user_controller_1.updateAccessToken, auth_1.isAutheticated, (0, auth_1.authorizaRoles)("user"), question_controller_1.submitTest);
questionRouter.post("/create-question", auth_1.isAutheticated, (0, auth_1.authorizaRoles)("admin"), question_controller_1.createQuestion);
exports.default = questionRouter;
