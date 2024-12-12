import express from "express";
import { authorizaRoles, isAutheticated } from "../middleware/auth";
import { createOrder, getAllOrder, newPayment, sendStripePublishableKey } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order",isAutheticated,createOrder);
orderRouter.get("/get-orders",updateAccessToken,isAutheticated,authorizaRoles("admin"),getAllOrder);

orderRouter.get("/payment/stripepublishablekey" , sendStripePublishableKey);
orderRouter.post("/payment",isAutheticated,newPayment);

export default orderRouter;