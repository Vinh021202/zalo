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
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const redis_1 = require("../utils/redis");
const getUserById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJson = yield redis_1.redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(201).json({
            success: true,
            user
        });
    }
});
exports.getUserById = getUserById;
// Get All users
const getAllUsersService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().sort({ createAt: -1 });
    res.status(201).json({
        success: true,
        users
    });
});
exports.getAllUsersService = getAllUsersService;
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
const updateUserRoleService = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Cập nhật vai trò người dùng trong cơ sở dữ liệu
        const user = yield user_model_1.default.findOneAndUpdate({ _id: id }, // Tìm người dùng theo email
        { role: role }, // Cập nhật vai trò
        { new: true } // Trả về bản ghi mới sau khi cập nhật
        );
        // Nếu không tìm thấy người dùng, ném lỗi
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        throw new Error("Error updating user role");
    }
});
exports.updateUserRoleService = updateUserRoleService;
