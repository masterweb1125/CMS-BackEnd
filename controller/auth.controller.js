import bcrypt from "bcryptjs";
import { userModel } from "../model/user.model.js";
import formidable from "formidable";
import fs from "fs";
import cloudinary from "../cloudinaryConfig.js";
import jwt from "jsonwebtoken";
import {
  SignIn_validate,
  SignUp_validate,
} from "../Schema_validation/auth.validation.js";
import sgMail from "@sendgrid/mail";
import { roleModel } from "../model/role.model.js";
import dotenv from "dotenv";
import { socialModel } from "../model/social.model.js";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const SignUp = async (req, res) => {
  // const { error } = SignUp_validate(req.body);
  // if (error) return res.status(400).json({ message: error.details[0].message, success: false, status: 400 });

  const { password, name, email } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    const verifyEmail = await userModel.findOne({ email });
    if (verifyEmail) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Email address is already registered!",
      });
    }

    const role = await roleModel.findOne({ _id: req.body.roleId });
    if (!role) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid role ID!" });
    }

    const createUser = new userModel({ ...req.body, password: hash });
    await createUser.save();

    const token = jwt.sign({ name, email }, process.env.TOKENKEY);

    res.cookie("roleId", role._id, { httpOnly: true });
    res.cookie("role", role.rolename, { httpOnly: true });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      success: true,
      status: 200,
      data: createUser,
      token,
      role: role.rolename,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: err.message });
  }
};

export const SignIn = async (req, res) => {
  const { error } = SignIn_validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ message: error.details[0].message, success: false, status: 400 });

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found!" });
    }

    if (user.password === undefined) {
      return res
        .status(201)
        .json({
          status: 201,
          success: true,
          message: "Please login with social provider",
        });
    }

    // Compare passwords
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    // console.log(password,user.password)
    if (!isCorrectPassword) {
      return res
        .status(400)
        .json({ status: 400, success: false, message: "Incorrect password" });
    }

    // Find role by roleId
    const role = await roleModel.findOne({ _id: user.roleId });
    if (!role) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "Invalid role ID!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: "user" },
      process.env.TOKENKEY
    );

    // Respond with user details and token
    const { password: _, ...userDetails } = user._doc; // Exclude password from response
    res.cookie("roleId", role._id, { httpOnly: true });
    res.cookie("role", role.rolename, { httpOnly: true });
    res.cookie("token", token, { httpOnly: true });
    return res
      .status(200)
      .json({ success: true, status: 200, data: userDetails, token });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

export const emailVerification = async (req, res) => {
  const { email, OTP } = req.body;
  const SenderEmail = process.env.SENDEREMAIL;

  const msg = {
    to: email,
    from: SenderEmail,
    subject: "Email verification",
    html: `<p>Your One-Time Passcode (OTP) to verify your email is: <strong>${OTP}</strong></p>
           <p>Please enter this code in the verification field on our website to confirm your email address.</p>`,
  };

  try {
    await sgMail.send(msg);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.toString(),
    });
  }
};

export const roleFind = async (req, res) => {
  try {
    const role = await roleModel.findOne({ rolename: req.body.name });

    return res.status(200).json({ roleId: role._id, status: true });
  } catch (error) {
    res.status(500).json({ error: error, status: false });
  }
};
export const roleFindById = async (req, res) => {
  try {
    const role = await roleModel.findOne({ _id: req.body.id });

    return res.status(200).json({ name: role.rolename, status: true });
  } catch (error) {
    res.status(500).json({ error: error, status: false });
  }
};

export const SocialAuth = async (req, res) => {
  try {
    const { email, name, provider_id, client_id } = req.body;
    const token = jwt.sign({ name, email }, process.env.TOKENKEY);
    const role = await roleModel.findOne({ _id: req.body.roleId });
    if (!role) {
      return res
        .status(401)
        .json({ success: false, status: 400, message: "Invalid role ID!" });
    }
    const verifyEmail = await userModel.findOne({ email });
    if (verifyEmail) {
      const social = await socialModel.findOne({ user_id: verifyEmail._id });
      if (!social) {
        const newsocial = await socialModel.create({
          provider_id,
          client_id,
          user_id: verifyEmail._id,
        });
        await newsocial.save();
      } else if (social) {
        const newsocial = await socialModel.findOneAndUpdate(
          { user_id: verifyEmail._id },
          { client_id: client_id, provider_id: provider_id }
        );
        await newsocial.save();
      }
      if (
        client_id != verifyEmail.client_id ||
        provider_id != verifyEmail.provider_id
      ) {
        verifyEmail.client_id = client_id;
        verifyEmail.provider_id = provider_id;
        await verifyEmail.save;
      }

      res.cookie("roleId", role._id, { httpOnly: true });
      res.cookie("role", role.rolename, { httpOnly: true });
      res.cookie("token", token, { httpOnly: true });
      return res
        .status(201)
        .json({
          msg: "user alrady exist id database",
          data: verifyEmail,
          success: true,
          status: 201,
          token,
        });
    }

    const createUser = new userModel({ ...req.body });
    await createUser.save().then(async (item) => {
      const social = new socialModel.create({
        client_id: client_id,
        provider_id: provider_id,
        user_id: item._id,
      });
      await social.save();
    });
    res.cookie("roleId", role._id, { httpOnly: true });
    res.cookie("role", role.rolename, { httpOnly: true });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      success: true,
      status: 200,
      msg: "Create new user",
      data: createUser,
      token,
      role: role.rolename,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error in social auth", error });
  }
};

export const handleUploadProfileImage = (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err, status: false });
    }

    let file = files.file;
    // console.log('file1',file)
    if (!file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", status: false });
    }

    const filePath = file[0].filepath;

    // Upload file to Cloudinary
    cloudinary.uploader.upload(
      filePath,
      { folder: "uploads" },
      (error, result) => {
        // Delete the temporary file
        fs.unlinkSync(filePath);

        if (error) {
          return res
            .status(500)
            .json({
              message: "Cloudinary upload failed",
              error: error,
              status: false,
            });
        }

        return res.json({
          status: true,
          message: "Image uploaded successfully",
          url: result.secure_url,
        });
        
      }
    );
  });
};

export const handleUpdateProfileImage = async (req, res) => {
  try {
    const { userId, imageUrl } = req.body;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found", status: false });
    }

    // Update the profile image
    user.profile_image = imageUrl;

    // Save the updated user
    const updatedUser = await user.save();

    // Confirm successful update and return response
    return res.status(200).json({ msg: "User profile image updated", data: updatedUser });

  } catch (error) {
    // Handle errors and send a 500 response
    return res.status(500).json({ msg: "Server error in updating profile image", error: error.message, status: false });
  }
};

export const getUserById = async (req,res)=>{
  try {
    const id  = req.params.id;
    const user =await userModel.findById(id);
    res.status(200).json({data:user,status:false})
  } catch (error) {
    res.status(500).json({msg:error.message,status:false})
  }
}