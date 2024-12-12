import { Response , NextFunction , Request } from "express";
import CourseModel from "../models/source.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
// create course 
export const createCourse = CatchAsyncError(async(data:any , res:Response , next:NextFunction)=> {
    // const course = await CourseModel.create(data);
    // res.status(200).json({
    //     success:true,
    //     course
    // })
    const course = await CourseModel.create(data);
   
    const courses = JSON.parse(await redis.get('allCourses')) || [];

        // Thêm khóa học mới
        courses.push({
            ...course,
            _id: course._id || new mongoose.Types.ObjectId().toString(), // Tạo ID nếu không có
            name: course.name,
            category:course.category,
            purchased: course.purchased,
            ratings: course.ratings,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Lưu lại vào Redis
        await redis.set('allCourses', JSON.stringify(courses));

    res.status(200).json({
        success:true,
        course
    })
})


// Get All users --- only admin
export const getAllCoursesService = async(res:Response)=>{
    const courses = await CourseModel.find().sort({createAt:-1});
    res.status(201).json({
        success:true,
        courses
    })
};