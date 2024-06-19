import bcrypt from "bcryptjs";
import { userModel } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {
  SignIn_validate,
  SignUp_validate,
} from "../Schema_validation/auth.validation.js";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { adminModel } from "../model/admin.model.js";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const SignUp = async (req, res) => {

  console.log("req.body: ", req.body);
  const {
    password,
    email,
    firstName,
    lastName,
    phone,
    role
  } = req.body;

  // encrypt password by using bcrypt algorithm
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    const verifyEmail = await adminModel.findOne({ email });

    //checking EMAIL VALIDATION / DUPLICATION
    if (!verifyEmail) {
      const createUser = new userModel({
        name: firstName,
        last_name: lastName,
       role,
         phone,
        email: email,
        password: hash,
      });
      await createUser.save();
      const token = jwt.sign(
        {
          name: firstName,
              email: email,
          role: role
        },
        "token_secret_key"
      );
      return res
        .status(200)
        .json({ success: true, status: 200, data: createUser, token: token });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          status: 400,
          data: "email address has already registered!",
        });
    }
  } catch (err) {
    // next(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: err,
    });
  }
};

// ----- sign in -----
export const SignIn = async (req, res) => {

  console.log(req.body);
  try {
    const User = await adminModel.findOne({ email: req.body.email });
    if (!User)
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User is not found!",
      });
    //   now checking password
    const isCorrect = await bcrypt.compare(req.body.password, User.password);
    // if the password is wrong.
    if (!isCorrect)
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Wrong credentials",
      });

    const token = jwt.sign(
      {
        id: User._id,
        name: User.name,
        email: User.email,
        role: "admin"
      },
      "token_secret_key"
    );

    const { password, ...detail } = User._doc;
    res.status(200).json({
      success: true,
      status: 200,
      data: detail,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

// ===   SendGrid sending email ---------

export const emailVerification = async (req, res) => {
  const { email, OTP } = req.body;
  console.log("req.body: ", req.body);
 const SenderEmail = "miyoshiyarou@gmail.com"

  const msg = {
    to: email,
    from: SenderEmail,
    subject: "Email verification",
    html: `
    <p>Your One-Time Passcode (OTP) to verify your email is: <strong>${OTP}</strong>  </p>
    
   <p>Please enter this code in the verification field on our website to confirm your email address.</p>
    
  `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent successfully"),
        res.status(200).json({
          success: true,
          message: "OTP send successfully",
        });
    })
    .catch((error) => {
      console.error(error.toString());
      res.status(500).json({
        success: false,
        message: "email sending failed",
        error: error,
      });
    });
};
