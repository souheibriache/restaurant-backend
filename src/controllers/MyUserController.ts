import { Request, Response } from "express";
import User, { UserType } from "../models/user";
import { error } from "console";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_AUTH_KEY = process.env.JWT_AUTH_KEY as string;

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.sendStatus(404).json({ message: "User not found!" });
    console.log({ user });
    res.json(user.toObject());
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).json({ message: "Something went wrong!" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  //CHECK IF USER EXISTS
  //CREATE USER IF DOESN'T EXIST
  //RETURN THE USER OBJECT

  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await hash(password);
    const newUser = new User({ email, name, password: hashedPassword });
    await newUser.save();

    const accessToken = await generateAccessToken(newUser);
    res.status(201).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Wrong credintials" });
    const isValidPassword = await compare(password, user?.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Wrong credintials" });

    const accessToken = await generateAccessToken(user);
    return res.json({ accessToken });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: " Something went wrong!" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  console.log({ body: req.body });
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    (user.addressLine1 = addressLine1), (user.country = country);
    user.city = city;
    await user.save();
    return res.status(201).json(user.toObject());
  } catch {
    console.log(error);
    res.status(500).json({ message: "Error updating User" });
  }
};

const hash = async (password: string) => {
  return bcrypt.hashSync(password, 10);
};

const compare = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateAccessToken = async (user: UserType) => {
  return await jwt.sign({ userId: user._id, name: user.name }, JWT_AUTH_KEY, {
    expiresIn: "1d",
  });
};
export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
  loginUser,
};
