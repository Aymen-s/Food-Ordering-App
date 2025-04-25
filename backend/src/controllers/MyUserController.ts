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

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    // 1. Check if the user exists
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 2. Update the user
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    const updatedUser = await user.save();
    // 3. Return the updated user
    res.send(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default { createCurrentUser, updateCurrentUser };
