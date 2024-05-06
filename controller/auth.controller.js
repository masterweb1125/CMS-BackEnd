import bcrypt from "bcryptjs";
import { userModel } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { SignIn_validate, SignUp_validate } from "../Schema_validation/auth.validation.js";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// ======= below are the googleapis detail for sending email ==========
// These id's and secrets should come from .env file.
const CLIENT_ID = "1032214045539-4us5na0revqlc676dncn8hjlclducstc.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =  "1//04G7UoxkfOBBMCgYIARAAGAQSNwF-L9IrmpkCiGDyjqEhsj_GLf4rWJwEexzjYQIjtwbkWg6kOsL2iEjKa06BfdKotX76BORSDIg";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// ======= END SECTION ==========




export const SignUp = async (
 req, res
) => {
  // const { error } = SignUp_validate(req.body);
  // if (error) return res.send(error.details[0].message);
 console.log("req.body: ", req.body);
  const { password, email, firstName, lastName, company_name, country, office_no, cell_phone, occupation } = req.body;
  
 
  // encrypt password by using bcrypt algorithm
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  try {
    const verifyEmail = await userModel.findOne({ email });

    //checking EMAIL VALIDATION / DUPLICATION 
    if (!verifyEmail) { 
      const createUser = new userModel({ 
          name: firstName, last_name:lastName,company_name, country, office_no, cell_phone, occupation,
          email: email,
        password: hash,
      });
      await createUser.save();
      const token = jwt.sign(
        {
          name: firstName,
          email: email,
        },
        "token_secret_key"
      );
      return res.status(200).json({success: true, status: 200, data: createUser, token: token});
    } else {
     return  res.status(400).json({success: false, status: 400, data: "email address has already registered!" });
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
export const SignIn = async ( req, res) => {
  // first we need to validate the data before saving it in DB
  const { error } = SignIn_validate(req.body);
  if (error) return res.status(400).json({message: error.details[0].message, success: false, status: 400});
  console.log(req.body);
  try {
    const User= await userModel.findOne({ email: req.body.email });
    if (!User)
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User is not found!",
      });
    //   now checking password
    const isCorrect = await bcrypt.compare(
      req.body.password,
      User.password
    );
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
      },
      "token_secret_key"
    );

    const { password, ...detail } = User._doc;
    res
      .status(200)
      .json({
        success: true,
        status: 200,
        data: detail,
        token: token,
      });
  } catch (error) {
    next(error);
  }
};



// ======== SENDING EMAIL USING GOOGLE APIs and nodemailer
// export const emailVerification = async (req, res) => {
//   const { email, OTP } = req.body;
//   console.log("req.body: ", req.body);

// const accessToken = await oAuth2Client.getAccessToken();

//   // Create a transporter object.
//  const transport = nodemailer.createTransport({
//    service: "gmail",
//    auth: {
//      type: "OAuth2",
//      user: "hikmatkhanbangash@gmail.com",
//      clientId: CLIENT_ID,
//      clientSecret: CLEINT_SECRET,
//      refreshToken: REFRESH_TOKEN,
//      accessToken: accessToken,
//    },
//    port: 587, // Use port 587 for Gmail OAuth
//    requireTLS: true, // Enable TLS encryption
//  });
  
  
//   const mailOptions = {
//     from: "hikmatkhanbangash@gmail.com",
//     to: email,
//     subject: "Email verification",
//     html: `
//     <p>Your One-Time Passcode (OTP) to verify your email is: <strong>${OTP}</strong>  </p>
    
//     <p>Please enter this code in the verification field on our website to confirm your email address.</p>
    
//   `,
//   };

//   transport.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       res.status(500).json({
//         success: false,
//         status: 500,
//         error: error,
//         message: "Sending email failed!",
//       });
//     } else {
//       console.log("Email sent!");
//       res.status(200).json({
//         success: true,
//         status: 200,
//         message: "Email send successfully!",
//       });
//     }
//   });
// };

// ----- Sending Email using only just nodemailer concept -----
// export const emailVerification = async (req, res) => {
//   const { email, OTP } = req.body;
//   console.log("req.body: ", req.body);
//   // Create a transporter object.
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     logger: true,
//     debug: true,
//     auth: {
//       user: "hikmatkhanbangash@gmail.com",
//       pass: "esov bwrj uybh wnpt",
//     },
//   });
//   const mailOptions = {
//     from: "hikmatkhanbangash@gmail.com",
//     to: email,
//     subject: "Email verification",
//     html: `
//     <p>Your One-Time Passcode (OTP) to verify your email is: <strong>${OTP}</strong>  </p>
    
//     <p>Please enter this code in the verification field on our website to confirm your email address.</p>
    
//   `,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       res.status(500).json({
//         success: false,
//         status: 500,
//         error: error,
//         message: "Sending email failed!",
//       });
//     } else {
//       console.log("Email sent!");
//       res.status(200).json({
//         success: true,
//         status: 200,
//         message: "Email send successfully!",
//       });
//     }
//   });
// };

// ===   SendGrid sending email ---------

export const emailVerification = async (req, res) => {
  const { email, OTP } = req.body;
  console.log("req.body: ", req.body);
  const SenderEmail = "miyoshiyarou@gmail.com";

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