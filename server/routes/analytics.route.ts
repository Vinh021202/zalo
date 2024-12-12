import express from "express";
import { authorizaRoles, isAutheticated } from "../middleware/auth";
import { getCoursesAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";


const analyticsRouter = express.Router();
analyticsRouter.get("/get-users-analytics",isAutheticated,authorizaRoles("admin"),getUsersAnalytics);
analyticsRouter.get("/get-courses-analytics",isAutheticated,authorizaRoles("admin"),getCoursesAnalytics);
analyticsRouter.get("/get-orders-analytics",isAutheticated,authorizaRoles("admin"),getOrdersAnalytics);

export default analyticsRouter;