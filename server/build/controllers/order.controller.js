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
exports.newPayment = exports.sendStripePublishableKey = exports.getAllOrder = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const source_model_1 = __importDefault(require("../models/source.model"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { courseId, payment_info } = req.body;
        // Kiểm tra thanh toán
        if (payment_info && "id" in payment_info) {
            const paymentIntentId = payment_info.id;
            const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId); // Sửa lỗi 'paymentIntens' thành 'paymentIntents'
            if (paymentIntent.status !== "succeeded") {
                return next(new ErrorHandler_1.default("Payment not authorized!", 400));
            }
        }
        // Kiểm tra người dùng và khóa học đã mua
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        const courseExistInUser = user === null || user === void 0 ? void 0 : user.courses.some((course) => course._id.toString() === courseId.toString());
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        // Kiểm tra khóa học tồn tại
        const course = yield source_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 400));
        }
        // Tạo dữ liệu đơn hàng
        const data = {
            courseId: course._id,
            userId: user === null || user === void 0 ? void 0 : user._id,
            payment_info
        };
        // Tạo nội dung email
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        };
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                yield (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        // Cập nhật người dùng và khóa học
        user === null || user === void 0 ? void 0 : user.courses.push(course === null || course === void 0 ? void 0 : course.id);
        yield redis_1.redis.set((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, JSON.stringify(user));
        yield (user === null || user === void 0 ? void 0 : user.save());
        // Thêm thông báo
        yield notification_model_1.default.create({
            user: user === null || user === void 0 ? void 0 : user._id,
            title: "New Order",
            message: `You have a new order from ${course === null || course === void 0 ? void 0 : course.name}`,
        });
        // Cập nhật số lượng người mua khóa học
        if (course.purchased) {
            course.purchased += 1;
        }
        yield course.save();
        // Gửi đơn hàng mới
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        console.log("Error details:", error.message);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get All Order
exports.getAllOrder = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// send stripe publishble key
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.CatchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
            return res.status(500).json({
                success: false,
                message: "Stripe publishable key is not set in the environment variables.",
            });
        }
        res.status(200).json({
            success: true,
            publishableKey,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the Stripe publishable key.",
        });
    }
}));
//new payment
exports.newPayment = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MyPayment = yield stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "USD",
            metadata: {
                company: "E-Learning",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.status(201).json({
            success: true,
            client_secret: MyPayment.client_secret,
        });
    }
    catch (error) {
        console.log(error.message);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
