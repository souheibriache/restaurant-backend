import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Joi from "joi";

export const validateRequest =
  (schema: Joi.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    console.log(error);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("eamil").isEmail(),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage(
      "Password must include at least: \n - 1 lowercase \n - 1 uppercase \n - 1 digit"
    ),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
  body("city").notEmpty().withMessage("city name is required"),
  body("country").notEmpty().withMessage("country name is required"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must me a positive number"),
  body("estimatedDeliveryTime")
    .isFloat({ min: 0 })
    .withMessage("estimated delivery time must me a positive number"),
  body("cuisines")
    .isArray()
    .withMessage("cuisines must me an array")
    .not()
    .isEmpty()
    .withMessage("Cuisines array must not be empty"),
  body("menuItems").isArray().withMessage("menu Items must me an array"),
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("menuItems name name is required"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("menuItems price must be positive"),
  handleValidationErrors,
];
