import { NextFunction , Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary"
import { createCourse, getAllCoursesService } from "../services/course.service";
import { url } from "inspector";
import CourseModel from "../models/source.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs, { Template } from "ejs"
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllUsersService } from "../services/user.service";
import axios from "axios";
import { title } from "process";
import userModel from "../models/user.model";

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


export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      // Xử lý thumbnail
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses"
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        };
      }

     

      const demoUrl = data.demoUrl;
      if (demoUrl) {
        const myCloud = await cloudinary.v2.uploader.upload(demoUrl, {
          folder: "courses",
          resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
        });
        data.demoUrl =  myCloud.secure_url

      }

      const dataCourses = data.courseData;

      const dataArrayVideo = [];
      const assignmentFiles = [];

      
      if(dataCourses) {
       
        for (let index = 0; index < data.courseData.length; index++) {
            const videoUrl = dataCourses[index].videoUrl || ""; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn
            const assignmentFile = dataCourses[index].assignmentFile || ""; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn

            if (videoUrl) {
                try {
                    // Upload video lên Cloudinary
                    const myCloud = await cloudinary.v2.uploader.upload(videoUrl, {
                        folder: "videos",
                        resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
                    });
                    const myCloud1 = await cloudinary.v2.uploader.upload(assignmentFile, {
                        folder: "assignmentFiles/",
                        resource_type: "auto", // Hoặc 'auto'
                        public_id: "assignment_" + Date.now(), // Đặt tên duy nhất
                        format: "pdf", // Gán định dạng PDF
                      });
    
                    // Thêm URL video đã upload vào mảng
                    dataArrayVideo.push(myCloud.secure_url);
                    assignmentFiles.push(myCloud1.secure_url);

                    data.courseData[index].videoUrl = dataArrayVideo[index]
                    data.courseData[index].assignmentFile = assignmentFiles[index]

                    console.log("Video assignmentFile: ", myCloud1.secure_url);

                } catch (error:any) {
                    console.error("Error uploading video: ", error.message);
                }
            }
        }
      }
      // Xử lý video

        createCourse(data,res,next);
      // Tạo khóa học và lưu vào cơ sở dữ liệu
    //   const course = await CourseModel.create(data); // Lưu trực tiếp vào cơ sở dữ liệu
    //   console.log("Course created:", course);
  
      // Trả về kết quả
  
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
});




//edit

  
  

export const editCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        // Kiểm tra nếu thumbnail có giá trị
        if (thumbnail) {
            // Kiểm tra nếu public_id tồn tại trong thumbnail trước khi gọi destroy
            if (thumbnail.public_id) {
                // Xóa ảnh cũ trên Cloudinary
                await cloudinary.v2.uploader.destroy(thumbnail.public_id);
            }

            // Tải ảnh mới lên Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
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
                await cloudinary.v2.uploader.destroy(demoUrl);

            }

        const myCloud = await cloudinary.v2.uploader.upload(demoUrl, {
          folder: "courses",
          resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
        });
        data.demoUrl =  myCloud.secure_url

      }

      const dataArrayVideo = [];
      const assignmentFiles = [];

      const dataCourses = data.courseData;

      if(dataCourses) {        
        for (let index = 0; index < data.courseData.length; index++) {
            const videoUrl = dataCourses[index].videoUrl; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn
            if (videoUrl) {
                try {

                    if (videoUrl) {
                        // Xóa ảnh cũ trên Cloudinary
                        await cloudinary.v2.uploader.destroy(videoUrl);                    
                    }
                    // Upload video lên Cloudinary
                    const myCloud = await cloudinary.v2.uploader.upload(videoUrl, {
                        folder: "videos",
                        resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
                    });
                    // Thêm URL video đã upload vào mảng
                    dataArrayVideo.push(myCloud.secure_url);
                    data.courseData[index].videoUrl = dataArrayVideo[index]
                } catch (error:any) {
                    console.error("Error uploading video: ", error.message);
                }
            }
        }
      }
      if(dataCourses) {        
        for (let index = 0; index < data.courseData.length; index++) {
            const assignmentFile = dataCourses[index].assignmentFiles; // Nếu videoUrl là URL, thay đổi theo cấu trúc dữ liệu của bạn
            if (assignmentFile) {
                try {

                    if (assignmentFile) {
                        // Xóa ảnh cũ trên Cloudinary
                        await cloudinary.v2.uploader.destroy(assignmentFile);                    
                    }
                    // Upload video lên Cloudinary
                    const myCloud = await cloudinary.v2.uploader.upload(assignmentFile, {
                        folder: "assignmentFiles/",
                        resource_type: "auto", // Hoặc 'auto'
                        public_id: "assignment_" + Date.now(), // Đặt tên duy nhất
                        format: "pdf", // Gán định dạng PDF
                      });
                    console.log("assignmentFile: " , assignmentFile);
                    
                    // Thêm URL video đã upload vào mảng
                    assignmentFiles.push(myCloud.secure_url);
                    data.courseData[index].assignmentFile = dataArrayVideo[index]
                } catch (error:any) {
                    console.error("Error uploading video: ", error.message);
                }
            }
        }
      }
      console.log("data course thumbnail: ",data);
        const courseId = req.params.id;
        // Cập nhật course trong database với dữ liệu mới
        const course = await CourseModel.findByIdAndUpdate(courseId, {
            $set: data
        }, { new: true });
        console.log('====================================');
        console.log("Courses late update: " , course);
        console.log('====================================');
        // Trả về dữ liệu course sau khi cập nhật
        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        // Xử lý lỗi và trả lại thông báo lỗi nếu có
        return next(new ErrorHandler(error.message, 500));
    }
});


// get single course ---- with purchasing

export const getSingleCourse = CatchAsyncError(async(req:Request , res:Response, next:NextFunction)=> {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis.get(courseId);
        if(isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success:true,
                course
            })
        }
       else {
        const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links");
        await redis.set(courseId,JSON.stringify(course),'EX',60602)

        res.status(200).json({
            success:true,
            course
        })
       }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})

// get all course
export const getAllCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const isCacheExist = await redis.get("allCourses");

        if(isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            res.status(200).json({
                success:true,
                courses
            })
        }
        else {
            const courses = await CourseModel.find();
            await redis.set("allCourses",JSON.stringify(courses))
            res.status(200).json({ 
                success:true,
                courses
            });
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))

    }
})


// get course content -- only for valid user
export const getCourseByUser = CatchAsyncError(async(req:Request, res:Response,next: NextFunction)=> {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course:any)=>course._id.toString() === courseId);

        if(!courseExists) {
            return next(new ErrorHandler("You are not eligible to access this course",404))
        }
        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;
        res.status(200).json({
            success : true,
            content
        })
    } catch (error) {
        
    }
})

// add question in course
interface IAddQuestion {
    question:string,
    courseId : string,
    contentId: string,
}

export const addQuestion = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const {question,courseId,contentId} : IAddQuestion = req.body;
        const course = await CourseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id",400))
        }

        const courseContent = course?.courseData.find((item:any) =>item._id.equals(contentId));
        console.log("COUTE TITLE: ", courseContent?.title);
        
        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id",400))
        }
        // create a new question object
        const newQuestion : any = {
            user: req.user,
            question,
            questionReplies:[],
        }

        // add this question to our course content
        courseContent.questions.push(newQuestion);
        
        await NotificationModel.create({
            user:req.user?._id,
            title:"New Question",
            message:`You have a new question in ${courseContent?.title}`,
        });

        // save the update course
        await course?.save();
        res.status(200).json({
            success:true,
            course
        })


    } catch (error : any) {
        return next(new ErrorHandler(error.message,500));
    }
})

// add answer in course question

interface IAddAnswer {
    answer:string,
    courseId : string,
    contentId:string,
    questionId:string
}

export const addAnswer = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {answer , courseId,contentId,questionId} :IAddAnswer = req.body;
        const course = await CourseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id",400))
        }

        const courseContent = course?.courseData.find((item:any) =>item._id.equals(contentId));
        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id",400))
        }

        const question = courseContent?.questions?.find((item:any)=>
            item._id.equals(questionId)
        );

        if(!question) {
            return next(new ErrorHandler("Invalid question id",400))
        }

        // create a new answer object
        const newAnswer:any = {
            user:req.user,
            answer,
            createAt: new Date().toString(),
            updateAt: new Date().toString(),
        }

        // add this answer to our course content
        question.questionReplies.push(newAnswer);
        await course?.save();
        if(req.user?._id === question.user._id) {
            // create a not notification
            await NotificationModel.create({
                user:req.user?.id,
                title:"New Question Reply Received",
                message:`You have a new question reply in ${courseContent.title}`
            })
        }else {
            const data = {
                name:question.user.name,
                title:courseContent.title,
            }
            const html = await ejs.renderFile(path.join(__dirname,"../mails/question-reply.ejs"),data);

            try {
                await sendMail({
                    email:question.user.email,
                    subject: "Question Reply",
                    template:"question-reply.ejs",
                    data
                })
            } catch (error:any) {
                return next(new ErrorHandler(error.message,500));

            }
        }
        res.status(200).json({
            success:true,
            course
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));

    }
})

// add review in course
interface IAddReviewData {
    review:string,
    courseId:string,
    rating:number,
    userId:string,
}

export const addReview = CatchAsyncError(async(req:Request , res:Response,next:NextFunction)=> {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        // check if courseId already exists in userCourseList based on _id
        const courseExists = userCourseList?.some((course:any)=> course._id.toString() ===courseId.toString());
        if(!courseExists) {
            return next(new ErrorHandler("You are not eligible to access this course",404));
        }
        const course = await CourseModel.findById(courseId);
        const {review,rating} = req.body as IAddReviewData;
        const reviewData:any = {
            user:req.user,
            comment:review,
            rating,
        }
        course?.reviews.push(reviewData);

        let avg = 0;
        course?.reviews.forEach((rev:any)=>{
            avg +=rev.rating
        });
        if(course) {
            course.ratings = avg / course.reviews.length; // vi du 2 nguoi review , 1 ng 4 1 ng 5 thi co gia tri = 9/2 = 4.5 ratings
        }


        await course?.save();

        await redis.set(courseId, JSON.stringify(course), "EX" , 604800) //7days

        // create notification 

        await NotificationModel.create({
            user:req.user?._id,
            title:"New review Received",
            message:`${req.user?.name} has given a review in ${course?.name}`
        });

        res.status(200).json({
            success:true,
            course
        })

    } catch (error:any) {
        console.log("Error reviews: " ,new ErrorHandler(error.message,500));
    
        
        return next(new ErrorHandler(error.message,500));

    }
})

// add reply in review
interface IAddReviewData {
    comment : string,
    courseId:string,
    reviewId:string
}
export const addReplyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, courseId, reviewId } = req.body as IAddReviewData;
        
        // Kiểm tra xem user đã được xác thực chưa
        if (!req.user) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        // Tìm khóa học
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        // Tìm bài đánh giá
        const review = course.reviews.find((rev: any) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler("Review not found", 400));
        }

        // Tạo dữ liệu trả lời
        const replyData: any = {
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
        await course.save();

        // Cập nhật lại cache Redis
        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 ngày

        // Trả về phản hồi thành công
        res.status(200).json({
            success: true,
            course,
        });

    } catch (error: any) {
        // Đảm bảo trả về thông báo lỗi chi tiết
        return next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
});

// getAdminAllCourse
export const getAdminAllCourses = CatchAsyncError(
    async (req:Request,res:Response,next:NextFunction) => {
        try {
            getAllCoursesService(res);
        } catch (error:any) {
            return next(new ErrorHandler(error.message,400))

        }
    }
);


// delete course -- only for admin
export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Tìm khóa học trong MongoDB
        const course = await CourseModel.findById(id);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // Xóa khóa học trong MongoDB
        await course.deleteOne();

        // Lấy dữ liệu từ Redis
        const courses = JSON.parse(await redis.get('allCourses')) || [];

        // Xóa khóa học khỏi danh sách trong Redis
        const updatedCourses = courses.filter(course => course._id !== id);

        // Lưu lại dữ liệu đã cập nhật vào Redis
        await redis.set('allCourses', JSON.stringify(updatedCourses));

        res.status(200).json({
            success: true,
            message: "Course deleted successfully from MongoDB and Redis",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// GENERATE VIDEO URL
export const generateVideoUrl = CatchAsyncError(async(req:Request , res:Response,next:NextFunction) => {
    try {
        const demoUrl = req.body.demoUrl; 
        if (demoUrl) {
            const myCloud = await cloudinary.v2.uploader.upload(demoUrl, {
              folder: "courses",
              resource_type: "video" // Đảm bảo rằng Cloudinary nhận diện đây là video
            });
            const demoUrlRes = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url
            };
            res.json(demoUrlRes);
          }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))

    }
});


export const addUserToCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Lấy courseId từ params
    const { userId } = req.body; // Lấy userId từ body
    console.log("Add User To Course Response:", id);
    console.log("Add User To Course Response:", userId);

    // Tìm khóa học
    const course = await CourseModel.findById(id);

    const user = await userModel.findById(userId)
    console.log("course: ",course)
    console.log("user: ",course)

    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }

    // Kiểm tra nếu user đã được thêm vào khóa học
    const isAlreadyRegistered = course.registeredUsers.some(
        (user: any) => user._id.toString() === id
    );

    if (isAlreadyRegistered) {
        return next(new ErrorHandler("User is already registered in this course", 400));
    }

    // Thêm user vào registeredUsers
    course.registeredUsers.push(user);
    await course.save();

    res.status(200).json({
        success: true,
        message: "User successfully added to the course.",
    });
});
