import express from "express";
import OrderController from "../controllers/OrderController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  OrderController.createCheckoutSession
);

router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

router.get("/", jwtCheck, OrderController.getMyOrders);

export default router;
