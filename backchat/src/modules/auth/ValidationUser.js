
import joi from "joi";
import { fileValidationGeneral } from "../../middleware/validation.js";

export const signUpSchema = {
  body: joi.object({
    username: joi.string().min(3).max(20).required().messages({
      "any.required":"name field is required",
      "string.empty":"Please fill your username field"
    }),
    email:fileValidationGeneral.email,
    password: fileValidationGeneral.password,
    confirm_pass: fileValidationGeneral.confirm_pass.valid(joi.ref("password")),
    image:joi.string()
  }).required(),
};

export const LoginSchema = {
  body: joi.object({
    email: fileValidationGeneral.email,
    password:fileValidationGeneral.password,
  }),
};

export const resetPassword = {
  body: joi.object({
    oldpassword: fileValidationGeneral.password,
    password:fileValidationGeneral.password.invalid(joi.ref("oldpassword")),
    confirm_pass:fileValidationGeneral.confirm_pass.valid(joi.ref("password")),
  }),
};


export const userPasswordResetGen = {
  body: joi.object({
    password: fileValidationGeneral.password,
    confirm_pass:fileValidationGeneral.confirm_pass.valid(joi.ref("password")),
    code:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required()
  }),
  params:joi.object({
    token:joi.string().required().messages({
      "any.required":" receiverId is required",
  }),
  }),
};

export const sendingemailValidation ={
  body: joi.object({
    email: fileValidationGeneral.email,

  }),
}