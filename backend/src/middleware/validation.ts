import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateMyUserRequest = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Name must be  a string and not empty"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Address Line 1 must be a string and not empty"),
  body("city")
    .isString()
    .notEmpty()
    .withMessage("City must be a string and not empty"),
  body("country")
    .isString()
    .notEmpty()
    .withMessage("Country must be a string and not empty"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName")
    .isString()
    .notEmpty()
    .withMessage("Restaurant name must be a string and not empty"),
  body("city")
    .isString()
    .notEmpty()
    .withMessage("City must be a string and not empty"),
  body("country")
    .isString()
    .notEmpty()
    .withMessage("Country must be a string and not empty"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be a number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage(
      "Estimated delivery time must be an integer and greater than or equal to 0"
    ),
  body("cuisine")
    .isArray()
    .withMessage("Cuisine must be an array of strings")
    .not()
    .isEmpty()
    .withMessage("Cuisine must not be empty"),
  body("menuItems")
    .isArray()
    .withMessage("Menu items must be an array of objects"),
  body("menuItems.*.name")
    .isString()
    .notEmpty()
    .withMessage("Menu item name must be a string and not empty"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu item price must be a number and greater than 0"),
  handleValidationErrors,
];
