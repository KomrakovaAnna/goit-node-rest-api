import Joi from 'joi';
import { emailRegexp } from '../constants/auth.js';

export const authRegisterSchema = Joi.object({
  email: Joi.string().trim().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Email must be a valid email address',
  }),
  password: Joi.string().min(8).max(30).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be less than 30 characters',
  }),
});

export const authVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().trim().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Email must be a valid email address',
  }),
  password: Joi.string().min(8).max(30).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be less than 30 characters',
  }),
});
