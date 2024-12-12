import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/source.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { json } from "stream/consumers";
import { redis } from "../utils/redis";

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// create order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;
        
        // Kiểm tra thanh toán
        if (payment_info && "id" in payment_info) {
            const paymentIntentId = payment_info.id;
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);  // Sửa lỗi 'paymentIntens' thành 'paymentIntents'
            
            if (paymentIntent.status !== "succeeded") {
                return next(new ErrorHandler("Payment not authorized!", 400));
            }
        }

        // Kiểm tra người dùng và khóa học đã mua
        const user = await userModel.findById(req.user?._id);
        const courseExistInUser = user?.courses.some((course: any) => course._id.toString() === courseId.toString());

        if (courseExistInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        // Kiểm tra khóa học tồn tại
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        // Tạo dữ liệu đơn hàng
        const data: any = {
            courseId: course._id,
            userId: user?._id,
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
        
        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });

        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }

        // Cập nhật người dùng và khóa học
        user?.courses.push(course?.id);
        await redis.set(req.user?.id, JSON.stringify(user));
        await user?.save();

        // Thêm thông báo
         await NotificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });

        // Cập nhật số lượng người mua khóa học
        if (course.purchased) {
            course.purchased += 1;
        }
        await course.save();

        // Gửi đơn hàng mới
        newOrder(data, res, next);
    } catch (error: any) {
        console.log("Error details:", error.message);
        return next(new ErrorHandler(error.message, 500));
    }
});


// get All Order
export const getAllOrder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllOrdersService(res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))

        }
    }
);

// send stripe publishble key

export const sendStripePublishableKey = CatchAsyncError(async (req: Request, res: Response) => {
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the Stripe publishable key.",
        });
    }
});

//new payment
export const newPayment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const MyPayment = await stripe.paymentIntents.create({
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
        })
    } catch (error: any) {
        console.log(error.message)
        return next(new ErrorHandler(error.message, 500));
    }
})
