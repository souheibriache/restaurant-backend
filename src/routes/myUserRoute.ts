import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  validateMyUserRequest,
  validateRequest,
} from "../middleware/validation";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validation-schema/user-validation-schema";

const router = express.Router();

router.get("/", jwtCheck, MyUserController.getCurrentUser);

router.post(
  "/register",
  validateRequest(createUserSchema),
  MyUserController.createCurrentUser
);

router.post(
  "/login",
  validateRequest(loginUserSchema),
  MyUserController.loginUser
);

router.put(
  "/",
  jwtCheck,
  validateRequest(updateUserSchema),
  MyUserController.updateCurrentUser
);
export default router;
