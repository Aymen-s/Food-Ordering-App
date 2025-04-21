const express = require("express");
const cors = require("cors");
import { Request, Response } from "express";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to Database");
});

const app = express();
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Enable CORS for all requests
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
