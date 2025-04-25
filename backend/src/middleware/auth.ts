import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      auth0Id?: string;
      userId?: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "No authorization header" });
    return;
  }

  const token = authorization.split(" ")[1];
  try {
    const auth0Id = req.auth?.payload?.sub;
    if (!auth0Id) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    req.auth0Id = auth0Id;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    console.error("Error parsing JWT:", error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
