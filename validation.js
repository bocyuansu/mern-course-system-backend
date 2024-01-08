const Joi = require('joi');

// 驗證使用者註冊時是否符合我們設定的條件
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      'string.empty': '用戶名稱不能是空的！',
      'string.min': '用戶名稱至少要3個字！',
      'string.max': '用戶名稱必須少於50個字！',
    }),
    email: Joi.string().min(6).max(50).required().email().messages({
      'string.empty': '信箱不能是空的！',
      'string.email': '信箱格式無效！',
      'string.min': '信箱至少要6個字！',
      'string.max': '信箱必須少於50個字！',
    }),
    password: Joi.string().min(6).max(25).required().messages({
      'string.empty': '密碼不能是空的！',
      'string.min': '密碼至少要6個字！',
      'string.max': '密碼必須少於25個字！',
    }),
    role: Joi.string().required().valid('student', 'instructor').messages({
      'any.only': '身份必須填寫student或instructor！',
    }),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email().messages({
      'string.empty': '信箱不能是空的！',
      'string.email': '信箱格式無效！',
      'string.min': '信箱至少要6個字！',
      'string.max': '信箱必須少於50個字！',
    }),
    password: Joi.string().min(6).max(255).required().messages({
      'string.empty': '密碼不能是空的！',
      'string.min': '密碼至少要6個字！',
      'string.max': '密碼必須少於25個字！',
    }),
  });

  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  courseValidation,
};
