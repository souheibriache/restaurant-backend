import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../models/user";

const JWT_AUTH_KEY = process.env.JWT_AUTH_KEY as string;

export const jwtCheck = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  console.log({ authorization });

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, JWT_AUTH_KEY, (error, decoded) => {
    if (error)
      return res.status(401).json({ message: "Authentication failed" });
    console.log({ decoded });
    req.userId = (decoded as any).userId;
    console.log({ userId: req.userId });
    next();
  });
};
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      auth0Id?: string;
    }
  }
}

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401).json({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.sendStatus(401);
    }
    req.auth0Id = auth0Id;
    req.userId = user?._id.toString();
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
};
