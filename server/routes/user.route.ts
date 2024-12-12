import express from 'express'
import { registrationUser ,activateUser, loginUser, logoutUser, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updatePassword, updateProfilePicture, getAllUsers, updateUserRole, deleteUser, getAllUserByCourse, getUsersByIds} from '../controllers/user.controller'
import { authorizaRoles, isAutheticated } from '../middleware/auth';
const userRouter = express.Router();
userRouter.post('/registration',registrationUser);
userRouter.post('/activate-user',activateUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',isAutheticated,logoutUser)
userRouter.get("/refresh",updateAccessToken)
userRouter.get("/me",updateAccessToken,isAutheticated,getUserInfo)
userRouter.post("/social-auth",socialAuth)
userRouter.put("/update-user-info",updateAccessToken,isAutheticated,updateUserInfo)
userRouter.put("/update-user-password",updateAccessToken,isAutheticated,updatePassword)
userRouter.put("/update-user-avatar",updateAccessToken,isAutheticated,updateProfilePicture)
userRouter.get("/get-users",updateAccessToken,isAutheticated,authorizaRoles("Teacher"),getAllUsers);
userRouter.get("/get-users-by-course/:id",updateAccessToken,isAutheticated,authorizaRoles("Teacher"),getAllUserByCourse);

userRouter.put("/update-user-role",updateAccessToken,isAutheticated,authorizaRoles("admin"),updateUserRole);
userRouter.put("/delete-user/:id",updateAccessToken,isAutheticated,deleteUser);
userRouter.post("/get-users-by-ids", getUsersByIds);

export default userRouter;