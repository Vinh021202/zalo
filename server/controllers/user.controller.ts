require("dotenv").config();
import { Request,Response,NextFunction } from "express";
import ejs from "ejs"
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import path from "path";
import sendMail from "../utils/sendMail";
import { redis } from "../utils/redis";
import {accessTokenOptions, refreshTokenOptions, sendToken} from '../utils/jwt';
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary"
import CourseModel from "../models/source.model";
// register user
interface IRegistrationBody {
    name:string,
    email:string,
    password:string,
    avatar?:string,

}
export const registrationUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const {name,email,password,avatar} = req.body;
        const isEmailExits = await userModel.findOne({email});
        if(isEmailExits) {
            return next(new ErrorHandler("Email already exist",400));
        };
        const user:IRegistrationBody = {
            name,
            email,
            password,
        };
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data  = {user:{name:user.name},activationCode};
        const html = await ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"),data);
        try {
            await sendMail({
                email:user.email,
                subject:"Active your account",
                template:"activation-mail.ejs",
                data
            });
            res.status(200).json({
                success:true,
                message:`Please check your email:${user.email} to active your account!`,
                activationToken:activationToken.token,
            });
        } catch (error:any) {
            return next(new ErrorHandler(error.message,400));
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
});

interface IActivationToken {
    token:string,
    activationCode:string;
}

export const createActivationToken = (user : any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random()*9000).toString();
    const token = jwt.sign({
        user,activationCode
    },process.env.ACTIVATION_SECRET as Secret, {
        expiresIn:"5m",
    });
    return {token,activationCode}
}

// activate user

interface IActivationRequest {
    activation_token : string,
    activation_code : string,
}

export const activateUser = CatchAsyncError(async(req:Request , res:Response, next:NextFunction) => {
    try {
        const {activation_token,activation_code} = req.body as IActivationRequest;
        const newUser: {user:IUser,activationCode:string}= jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        )as {user:IUser;activationCode:string};
        if(newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code",400));
        }

        const {name,email,password} = newUser.user;
        const existUser = await userModel.findOne({email});
        if(existUser) {
            return next(new ErrorHandler("Email aready exist",400));
        }
        const user = await userModel.create({
            name,
            email,
            password
        });
        res.status(200).json({
            success:true,
            message:"Register success"
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})

// Login user
interface IloginRequest {
    email:string,
    password:string
}

export const loginUser = CatchAsyncError(async(req:Request , res:Response,next:NextFunction)=> {
    try {
        const {email,password} = req.body as IloginRequest;
        if(!email || !password) {
            return next(new ErrorHandler("Please enter email and password",400));
        }
        const user = await userModel.findOne({email}).select("+password");
        if(!user) {
            return next(new ErrorHandler("Invalid email or password",400));
        }

        const isPasswordMath = await user.comparePassword(password);
        if(!isPasswordMath) {
            return next(new ErrorHandler("Invalid email or password",400));
        }
        sendToken(user,200,res);
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
}) 

// logout

export const logoutUser = CatchAsyncError(async(req:Request , res:Response , next:NextFunction) => {
    try {
        res.cookie("access_token","",{maxAge:1})
        res.cookie("refresh_token","",{maxAge:1})
        const userId = req.user?._id || ''
        redis.get(userId);
        res.status(200).json({
            success:true,
            message:"Logged out successfully"
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})

// update access token
export const updateAccessToken = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(refresh_token,process.env.REFRESH_TOKEN as string) as JwtPayload;
        const message = 'Could not refresh Token';
        if(!decoded) {
            return next(new ErrorHandler(message,400));
        }
        const session = await redis.get(decoded.id as string)
        if(!session) {
            return next(new ErrorHandler("Please login for access this resources!",400));
        }
        const user = JSON.parse(session);
        const accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN as string,{
            expiresIn:"5m",
        });
        const refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN as string,{
            expiresIn:"3d",
        });

        req.user = user;

        res.cookie("access_token",accessToken,accessTokenOptions)
        res.cookie("refresh_token",refreshToken,refreshTokenOptions);
        await redis.set(user._id,JSON.stringify(user),"EX",604800); // 7days
        next();
    } catch (error : any) {
        return next(new ErrorHandler(error.message,400))
    }
})

// GETUSER INFO
export const getUserInfo = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const userId = req.user?._id;
        getUserById(userId,res);
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))

    }
})

interface ISocialAuthBody {
    email:string,
    name:string,
    avatar:string
}

// social auth
export const socialAuth = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const {email,name,avatar} = req.body as ISocialAuthBody;
        const user = await userModel.findOne({email});
        if(!user) {
            const newUser = await userModel.create({email,name,avatar});
            sendToken(newUser,200,res);
        }
        else {
            sendToken(user,200,res);
        }

    } catch (error : any) {
        return next(new ErrorHandler(error.message,400))

    }
})

// update info user
interface IUpdateUserInfo{
    name?:string,
    email?:string,
    
}

export const updateUserInfo = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const {name,email} = req.body as IUpdateUserInfo
        const userId = req.user?._id;
        const user = await userModel.findById(userId);
        if(email && user) {
            const isEmailExist = await userModel.findOne({email});
            if(!isEmailExist) {
                return next(new ErrorHandler("Email already exist",400))
            }
            user.email = email;
        }

        if(name && user) {
            user.name = name
        }

        await user?.save();
        await redis.set(userId,JSON.stringify(user));
        

        res.status(200).json({
            success:true,
            user
        })

    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))

    }
})

// update user password
interface IUpdatePassword {
    oldPassword : string,
    newPassword : string
}

export const updatePassword = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {oldPassword,newPassword} = req.body as IUpdatePassword;
        if(!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password",400));
        }
        const user = await userModel.findById(req.user?._id).select("+password");
       
        if(user?.password === undefined) {
            return next(new ErrorHandler("Invalid user",400));
        }
        const isPasswordMath = await user?.comparePassword(oldPassword);
        if(!isPasswordMath) {
            return next(new ErrorHandler("Invalid old password",400));
        }
        user.password = newPassword;
        await user?.save();
        await redis.set(req.user?.id , JSON.stringify(user))
        res.status(201).json({
            success:true,
            user
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))

    }
})

interface IUpdateProfileAPicture {
    avatar: string
}

// update profile avatar
export const updateProfilePicture = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const {avatar} = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);

       if(avatar && user){
        // if user have one avatar then call this if
        if(user?.avatar?.public_id) {
            // first delete the old image
            await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
            const myCloud =    await cloudinary.v2.uploader.upload(avatar,{
                folder:"avatars",
                width:150
            });
            user.avatar = {
                public_id : myCloud.public_id,
                url:myCloud.secure_url
            }
        }else {
            const myCloud =    await cloudinary.v2.uploader.upload(avatar,{
                folder:"avatars",
                width:150
            });
            user.avatar = {
                public_id : myCloud.public_id,
                url:myCloud.secure_url
            }
        }
       }
       await user?.save();
       await redis.set(req.user?.id,JSON.stringify(user));
       res.status(200).json({
        success:true,
        user,
       });
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))

    }
})
// get All user
export const getAllUsers = CatchAsyncError(
    async (req:Request,res:Response,next:NextFunction) => {
        try {
            getAllUsersService(res);
        } catch (error:any) {
            return next(new ErrorHandler(error.message,400))

        }
    }
);




// / update user roles --only for admin
// export const updateUserRole = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
//     try {
//         const {email,role} = req.body;
//         console.log("dữ liệu nhận được từ fontend user", req.body);
        
//         updateUserRoleService(res,email,role);
//         console.log("dữ liệu lưu được", updateUserRoleService(res,email,role));
        
//     } catch (error:any) {
//         return next(new ErrorHandler(error.message,400))
//     }
// })

export const updateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        console.log("Dữ liệu nhận được từ frontend user", req.body);

        // Gọi service để cập nhật vai trò người dùng
        const updatedUser = await updateUserRoleService(id, role);
        
        // Trả về kết quả đã cập nhật
        console.log("Dữ liệu lưu được", updatedUser);
        res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            user: updatedUser,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



// delete user -- only for admin
export const deleteUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const {id} = req.params;
        const user = await userModel.findById(id);
        if(!user){
            return next(new ErrorHandler("User not found",400));
        }

        await user.deleteOne({id});
        await redis.del(id);
        res.status(200).json({
            success:true,
            messgae:"User deleted successfully"
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))

    }
})

export const getAllUserByCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
    try {
        
        const {id} = req.params;
        const course = await CourseModel.findById(id);
       
        
        res.status(200).json({
           success:true,
        course
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))

    }
})

export const getUsersByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body; // Nhận danh sách userId từ body
      const users = await userModel.find({ _id: { $in: ids } }); // Lấy tất cả người dùng khớp với danh sách _id
      res.status(200).json({ success: true, users });
    } catch (error:any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };