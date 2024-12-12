import userModel from "../models/user.model"
import { NextFunction, Response } from "express";
import { redis } from "../utils/redis";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
export const getUserById = async (id:string,res:Response) =>{
    const userJson = await redis.get(id);
    if(userJson) {
        const user = JSON.parse(userJson)     
    
    res.status(201).json({
        success:true,
        user
     })
    }
}

// Get All users
export const getAllUsersService = async(res:Response)=>{
    const users = await userModel.find().sort({createAt:-1});
    res.status(201).json({
        success:true,
        users
    })
};

// get all users --- only for admin
// / update user roles --only for admin
// export const updateUserRoleService = async(res:Response,id:string,role:string)=> {
//     try {
//         const user = await userModel.findByIdAndUpdate(id,{role},{new:true})
//         res.status(200).json({
//             success:true,
//             user
//         })
        
//     } catch (error) {
        
//     }
// }
// Service xử lý cập nhật vai trò người dùng trong cơ sở dữ liệu
export const updateUserRoleService = async (id: string, role: string) => {
    try {
        // Cập nhật vai trò người dùng trong cơ sở dữ liệu
        const user = await userModel.findOneAndUpdate(
            { _id: id },  // Tìm người dùng theo email
            { role: role },     // Cập nhật vai trò
            { new: true }       // Trả về bản ghi mới sau khi cập nhật
        );

        // Nếu không tìm thấy người dùng, ném lỗi
        if (!user) {
            throw new Error("User not found");
        }

        return user;
    } catch (error) {
        throw new Error("Error updating user role");
    }
};