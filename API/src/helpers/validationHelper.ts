import { body } from 'express-validator';

export const userValidationRules = () => [
  body('lastName').isString().notEmpty(),
  body('firstName').isString().notEmpty(),
  body('email').isEmail(),
  body('address').isString().notEmpty(),
  body('phone').isString().notEmpty(),
  body('cityName').isString().notEmpty(),
  body('password').isString().notEmpty(),
];

export const loginValidationRules = () => [
  body('email').isEmail(),
  body('password').isString().notEmpty(),
];
