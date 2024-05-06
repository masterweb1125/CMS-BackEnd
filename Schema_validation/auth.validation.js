import Joi from "joi";
// SignUp Validation
export const SignUp_validate = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .message("Name must be 3 characters long")
      .max(20)
      .message("Name should not exceed 20 characters long")
      .pattern(new RegExp("^[a-zA-Z ._-]*$"))
      .message("Only Alphabets are allowed in name field")
      .required(),

      email: Joi.string().email().required(),

    password: Joi.string().min(6).max(20).required(),

    profile_image: Joi.string(),
  });

  const valid = schema.validate(data);
  return valid;
};

// SignIn Validation
export const SignIn_validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().min(6).max(20).required(),
  });

  const valid = schema.validate(data);
  return valid;
};
