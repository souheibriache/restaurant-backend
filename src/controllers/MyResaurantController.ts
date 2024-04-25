import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { uploadImage } from "../utils/upload-image";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    console.log({ existingRestaurant, user: req.userId });
    if (existingRestaurant)
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });

    const newRestaurant = new Restaurant({
      ...req.body,
    });
    newRestaurant.imageUrl = await uploadImage(req.file as Express.Multer.File);
    newRestaurant.user = new mongoose.Types.ObjectId(req.userId);
    newRestaurant.lastUpdated = new Date();
    await newRestaurant.save();
    console.log({ newRestaurant, requestBody: req.body });

    return res.send(newRestaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const currentRestaurant = await Restaurant.findOne({ user: userId });
    if (!currentRestaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }
    let {
      restaurantName,
      city,
      country,
      menuItems,
      cuisines,
      deliveryPrice,
      estimatedDeliveryTime,
      imageUrl,
    } = req.body;

    currentRestaurant.restaurantName = restaurantName;
    currentRestaurant.city = city;
    currentRestaurant.country = country;
    currentRestaurant.menuItems = menuItems;
    currentRestaurant.cuisines = cuisines;
    currentRestaurant.deliveryPrice = deliveryPrice;
    currentRestaurant.estimatedDeliveryTime = estimatedDeliveryTime;

    if (req.file) {
      currentRestaurant.imageUrl = await uploadImage(
        req.file as Express.Multer.File
      );
    }

    currentRestaurant.lastUpdated = new Date();
    await currentRestaurant.save();

    res.status(200).send(currentRestaurant);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export default { createMyRestaurant, getMyRestaurant, updateMyRestaurant };
