import NotificationModel from "../models/notification.model";
import { NextFunction,Response,Request } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron"

export const getAllNotification = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const notifications = await NotificationModel.find().sort({createdAt : -1});
        res.status(201).json({
            success:true,
            notifications
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
});


// update notifications status --- only admin
export const updateNotification = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        notification?.status ? notification.status = 'read' : notification?.status;
        if(!notification) {
            return next(new ErrorHandler("Notification not found",500));
        }else{
            notification?.status ? notification.status = 'read' : notification?.status;
        }
        await notification.save();
        const notifications = await NotificationModel.find().sort({createAt:-1});
        res.status(201).json({
            success:true,
            notifications
        });
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})

// delete notification -- only admin
cron.schedule("0 0 0 * * *",async() => {
    const thirtDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({createAt: {status:"read",createAt : {$lt : thirtDaysAgo}}});
})