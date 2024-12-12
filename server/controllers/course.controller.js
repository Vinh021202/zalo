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
exports.generateVideoUrl = exports.deleteCourse = exports.getAdminAllCourses = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourse = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const source_model_1 = __importDefault(require("../models/source.model"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
// export const uploadCourse = CatchAsyncError(async(req:Request , res:Response,next:NextFunction)=> {
//     try {
//         const data = req.body;
//         console.log("data coures", data);
//         const thumbnail = data.thumbnail;
//         if(thumbnail) {
//             const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
//                 folder:"courses"
//             });
//             data.thumbnail= {
//                 public_id : myCloud.public_id,
//                 url : myCloud.secure_url
//             }
//         }
//         createCourse(data,res,next);
//     } catch (error : any) {
//         return next(new ErrorHandler(error.message,500));
//     }
//     console.log("Dữ liệu nhận được từ Frontend:", req.body);
// })
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        // Xử lý thumbnail
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        const demoUrl = data.demoUrl;
        if (demoUrl) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(demoUrl, {
                folder: "courses",
                resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
            });
            data.demoUrl = myCloud.secure_url;
        }
        const dataCourses = data.courseData;
        const dataArrayVideo = [];
        const assignmentFiles = [];
        if (dataCourses) {
            for (let index = 0; index < data.courseData.length; index++) {
                const videoUrl = dataCourses[index].videoUrl || ""; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn
                const assignmentFile = dataCourses[index].assignmentFile || ""; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn
                if (videoUrl) {
                    try {
                        // Upload video lên Cloudinary
                        const myCloud = yield cloudinary_1.default.v2.uploader.upload(videoUrl, {
                            folder: "videos",
                            resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
                        });
                        const myCloud1 = yield cloudinary_1.default.v2.uploader.upload(assignmentFile, {
                            folder: "assignmentFiles/",
                            resource_type: "auto", // Hoặc 'auto'
                            public_id: "assignment_" + Date.now(), // Đặt tên duy nhất
                            format: "pdf", // Gán định dạng PDF
                        });
                        // Thêm URL video đã upload vào mảng
                        dataArrayVideo.push(myCloud.secure_url);
                        assignmentFiles.push(myCloud1.secure_url);
                        data.courseData[index].videoUrl = dataArrayVideo[index];
                        data.courseData[index].assignmentFile = assignmentFiles[index];
                        console.log("Video assignmentFile: ", myCloud1.secure_url);
                    }
                    catch (error) {
                        console.error("Error uploading video: ", error.message);
                    }
                }
            }
        }
        // Xử lý video
        (0, course_service_1.createCourse)(data, res, next);
        // Tạo khóa học và lưu vào cơ sở dữ liệu
        //   const course = await CourseModel.create(data); // Lưu trực tiếp vào cơ sở dữ liệu
        //   console.log("Course created:", course);
        // Trả về kết quả
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
//edit
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        // Kiểm tra nếu thumbnail có giá trị
        if (thumbnail) {
            // Kiểm tra nếu public_id tồn tại trong thumbnail trước khi gọi destroy
            if (thumbnail.public_id) {
                // Xóa ảnh cũ trên Cloudinary
                yield cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id);
            }
            // Tải ảnh mới lên Cloudinary
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            // Cập nhật thumbnail mới vào dữ liệu
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        const demoUrl = data.demoUrl;
        if (demoUrl) {
            if (demoUrl) {
                // Xóa ảnh cũ trên Cloudinary
                yield cloudinary_1.default.v2.uploader.destroy(demoUrl);
            }
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(demoUrl, {
                folder: "courses",
                resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
            });
            data.demoUrl = myCloud.secure_url;
        }
        const dataArrayVideo = [];
        const assignmentFiles = [];
        const dataCourses = data.courseData;
        if (dataCourses) {
            for (let index = 0; index < data.courseData.length; index++) {
                const videoUrl = dataCourses[index].videoUrl; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn
                if (videoUrl) {
                    try {
                        if (videoUrl) {
                            // Xóa ảnh cũ trên Cloudinary
                            yield cloudinary_1.default.v2.uploader.destroy(videoUrl);
                        }
                        // Upload video lên Cloudinary
                        const myCloud = yield cloudinary_1.default.v2.uploader.upload(videoUrl, {
                            folder: "videos",
                            resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
                        });
                        // Thêm URL video đã upload vào mảng
                        dataArrayVideo.push(myCloud.secure_url);
                        data.courseData[index].videoUrl = dataArrayVideo[index];
                    }
                    catch (error) {
                        console.error("Error uploading video: ", error.message);
                    }
                }
            }
        }
        if (dataCourses) {
            for (let index = 0; index < data.courseData.length; index++) {
                const assignmentFile = dataCourses[index].assignmentFiles; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn
                if (assignmentFile) {
                    try {
                        if (assignmentFile) {
                            // Xóa ảnh cũ trên Cloudinary
                            yield cloudinary_1.default.v2.uploader.destroy(assignmentFile);
                        }
                        // Upload video lên Cloudinary
                        const myCloud = yield cloudinary_1.default.v2.uploader.upload(assignmentFile, {
                            folder: "assignmentFiles/",
                            resource_type: "auto", // Hoặc 'auto'
                            public_id: "assignment_" + Date.now(), // Đặt tên duy nhất
                            format: "pdf", // Gán định dạng PDF
                        });
                        console.log("assignmentFile: ", assignmentFile);
                        // Thêm URL video đã upload vào mảng
                        assignmentFiles.push(myCloud.secure_url);
                        data.courseData[index].assignmentFile = dataArrayVideo[index];
                    }
                    catch (error) {
                        console.error("Error uploading video: ", error.message);
                    }
                }
            }
        }
        console.log("data course thumbnail: ", data);
        const courseId = req.params.id;
        // Cập nhật course trong database với dữ liệu mới
        const course = yield source_model_1.default.findByIdAndUpdate(courseId, {
            $set: data
        }, { new: true });
        console.log('====================================');
        console.log("Courses late update: ", course);
        console.log('====================================');
        // Trả về dữ liệu course sau khi cập nhật
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        // Xử lý lỗi và trả lại thông báo lỗi nếu có
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get single course ---- with purchasing
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        const isCacheExist = yield redis_1.redis.get(courseId);
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course
            });
        }
        else {
            const course = yield source_model_1.default.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links");
            yield redis_1.redis.set(courseId, JSON.stringify(course), 'EX', 60602);
            res.status(200).json({
                success: true,
                course
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get all course
exports.getAllCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isCacheExist = yield redis_1.redis.get("allCourses");
        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                courses
            });
        }
        else {
            const courses = yield source_model_1.default.find();
            yield redis_1.redis.set("allCourses", JSON.stringify(courses));
            res.status(200).json({
                success: true,
                courses
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get course content -- only for valid user
exports.getCourseByUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userCourseList = (_a = req.user) === null || _a === void 0 ? void 0 : _a.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.find((course) => course._id.toString() === courseId);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = yield source_model_1.default.findById(courseId);
        const content = course === null || course === void 0 ? void 0 : course.courseData;
        res.status(200).json({
            success: true,
            content
        });
    }
    catch (error) {
    }
}));
exports.addQuestion = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { question, courseId, contentId } = req.body;
        const course = yield source_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        const courseContent = course === null || course === void 0 ? void 0 : course.courseData.find((item) => item._id.equals(contentId));
        console.log("COUTE TITLE: ", courseContent === null || courseContent === void 0 ? void 0 : courseContent.title);
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        // create a new question object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        // add this question to our course content
        courseContent.questions.push(newQuestion);
        yield notification_model_1.default.create({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            title: "New Question",
            message: `You have a new question in ${courseContent === null || courseContent === void 0 ? void 0 : courseContent.title}`,
        });
        // save the update course
        yield (course === null || course === void 0 ? void 0 : course.save());
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.addAnswer = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = yield source_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        const courseContent = course === null || course === void 0 ? void 0 : course.courseData.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        const question = (_a = courseContent === null || courseContent === void 0 ? void 0 : courseContent.questions) === null || _a === void 0 ? void 0 : _a.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler_1.default("Invalid question id", 400));
        }
        // create a new answer object
        const newAnswer = {
            user: req.user,
            answer,
            createAt: new Date().toString(),
            updateAt: new Date().toString(),
        };
        // add this answer to our course content
        question.questionReplies.push(newAnswer);
        yield (course === null || course === void 0 ? void 0 : course.save());
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b._id) === question.user._id) {
            // create a not notification
            yield notification_model_1.default.create({
                user: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                title: "New Question Reply Received",
                message: `You have a new question reply in ${courseContent.title}`
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                yield (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.addReview = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userCourseList = (_a = req.user) === null || _a === void 0 ? void 0 : _a.courses;
        const courseId = req.params.id;
        // check if courseId already exists in userCourseList based on _id
        const courseExists = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.some((course) => course._id.toString() === courseId.toString());
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = yield source_model_1.default.findById(courseId);
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            comment: review,
            rating,
        };
        course === null || course === void 0 ? void 0 : course.reviews.push(reviewData);
        let avg = 0;
        course === null || course === void 0 ? void 0 : course.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if (course) {
            course.ratings = avg / course.reviews.length; // vi du 2 nguoi review , 1 ng 4 1 ng 5 thi co gia tri = 9/2 = 4.5 ratings
        }
        yield (course === null || course === void 0 ? void 0 : course.save());
        yield redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); //7days
        // create notification 
        yield notification_model_1.default.create({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            title: "New review Received",
            message: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.name} has given a review in ${course === null || course === void 0 ? void 0 : course.name}`
        });
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        console.log("Error reviews: ", new ErrorHandler_1.default(error.message, 500));
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.addReplyToReview = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { comment, courseId, reviewId } = req.body;
        // Kiểm tra xem user đã được xác thực chưa
        if (!req.user) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        // Tìm khóa học
        const course = yield source_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 400));
        }
        // Tìm bài đánh giá
        const review = course.reviews.find((rev) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 400));
        }
        // Tạo dữ liệu trả lời
        const replyData = {
            user: req.user,
            comment,
            createAt: new Date(),
            updateAt: new Date(),
        };
        // Nếu bài đánh giá không có phản hồi, tạo mới mảng commentReplies
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        // Thêm dữ liệu phản hồi vào bài đánh giá
        review.commentReplies.push(replyData);
        // Lưu khóa học sau khi cập nhật
        yield course.save();
        // Cập nhật lại cache Redis
        yield redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 ngày
        // Trả về phản hồi thành công
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        // Đảm bảo trả về thông báo lỗi chi tiết
        return next(new ErrorHandler_1.default(error.message || "Internal Server Error", 500));
    }
}));
// getAdminAllCourse
exports.getAdminAllCourses = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// delete course -- only for admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Tìm khóa học trong MongoDB
        const course = yield source_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Xóa khóa học trong MongoDB
        yield course.deleteOne();
        // Lấy dữ liệu từ Redis
        const courses = JSON.parse(yield redis_1.redis.get('allCourses')) || [];
        // Xóa khóa học khỏi danh sách trong Redis
        const updatedCourses = courses.filter(course => course._id !== id);
        // Lưu lại dữ liệu đã cập nhật vào Redis
        yield redis_1.redis.set('allCourses', JSON.stringify(updatedCourses));
        res.status(200).json({
            success: true,
            message: "Course deleted successfully from MongoDB and Redis",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// GENERATE VIDEO URL
exports.generateVideoUrl = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const demoUrl = req.body.demoUrl;
        if (demoUrl) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(demoUrl, {
                folder: "courses",
                resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
            });
            const demoUrlRes = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
            res.json(demoUrlRes);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
