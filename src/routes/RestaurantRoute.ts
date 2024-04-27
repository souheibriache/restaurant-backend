import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";
import { ObjectId } from "mongodb";

const router = express.Router();

// api/restaurant

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
  RestaurantController.searchRestaurants
);

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Restaurant Id MY be provided"),
  RestaurantController.getRestaurantById
);

export default router;
