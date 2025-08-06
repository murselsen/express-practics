import Joi from 'joi';

export const createStudentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string format ',
    'string.min': 'Name should be at least 3 characters long',
    'string.max': 'Name should not exceed 30 characters',
    'any.required': 'Name is required',
  }),
  age: Joi.number().integer().min(6).max(16).required().messages({
    'number.base': 'Age should be a number type',
    'number.min': 'Age should be at least 6 years old',
    'number.max': 'Age should not exceed 16 years old',
    'any.required': 'Age is required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'string.base': 'Gender should be a string',
    'any.required': 'Gender is required',
  }),

  avgMark: Joi.number().min(2).max(12).required().messages({
    'number.base': 'Average mark should be a number',
    'number.min': 'Average mark should be at least 2',
    'number.max': 'Average mark should not exceed 12',
    'any.required': 'Average mark is required',
  }),

  onDuty: Joi.boolean().messages({
    'boolean.base': 'OnDuty should be a boolean value',
    'any.required': 'OnDuty status is required',
  }),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Name should be a string format',
    'string.min': 'Name should be at least 3 characters long',
    'string.max': 'Name should not exceed 30 characters',
  }),
  age: Joi.number().integer().min(6).max(16).messages({
    'number.base': 'Age should be a number type',
    'number.min': 'Age should be at least 6 years old',
    'number.max': 'Age should not exceed 16 years old',
  }),
  gender: Joi.string().valid('male', 'female', 'other'),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});
