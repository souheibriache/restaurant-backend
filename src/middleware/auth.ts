import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import * as jwt from "jsonwebtoken";
import User from "../models/user";
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_SIGN_IN_ALG,
});

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
