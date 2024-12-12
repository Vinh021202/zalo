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
exports.getAllCoursesService = exports.createCourse = void 0;
const source_model_1 = __importDefault(require("../models/source.model"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
// create course 
exports.createCourse = (0, catchAsyncErrors_1.CatchAsyncError)((data, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const course = await CourseModel.create(data);
    // res.status(200).json({
    //     success:true,
    //     course
    // })
    const course = yield source_model_1.default.create(data);
    const courses = JSON.parse(yield redis_1.redis.get('allCourses')) || [];
    // Thêm khóa học mới
    courses.push(Object.assign(Object.assign({}, course), { _id: course._id || new mongoose_1.default.Types.ObjectId().toString(), name: course.name, category: course.category, purchased: course.purchased, ratings: course.ratings, createdAt: new Date(), updatedAt: new Date() }));
    // Lưu lại vào Redis
    yield redis_1.redis.set('allCourses', JSON.stringify(courses));
    res.status(200).json({
        success: true,
        course
    });
}));
// Get All users --- only admin
const getAllCoursesService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield source_model_1.default.find().sort({ createAt: -1 });
    res.status(201).json({
        success: true,
        courses
    });
});
exports.getAllCoursesService = getAllCoursesService;
