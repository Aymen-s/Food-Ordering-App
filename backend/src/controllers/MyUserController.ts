import { Request, Response } from "express";
import User from "../models/User";

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    // 1. Check if the user exists
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      res.status(200).send();
      return;
    }

    // 2. Create the user
    const newUser = new User(req.body);
    await newUser.save();

    // 3. Return the user
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export default { createCurrentUser };
