import Joi from "joi";

export const createUserSchema = Joi.object().keys({
  name: [Joi.string().min(3)],
  email: [Joi.string().email()],
  password: [Joi.string().min(6).max(32)],
});

export const loginUserSchema = Joi.object().keys({
  email: [Joi.string().email()],
  password: [Joi.string().min(6).max(32)],
});

export const updateUserSchema = Joi.object().keys({
  email: [Joi.string().email()],
  name: [Joi.string().optional()],
  addressLine1: [Joi.string().optional()],
  city: [Joi.string().optional()],
  country: [Joi.string().optional()],
});
