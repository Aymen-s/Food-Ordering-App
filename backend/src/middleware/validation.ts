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
