import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import { tourModel } from "../model/booking.model.js";
tourModel;

export const createTour = async (req, res) => {
  console.log("req.body: ", req.body);

  try {
    const tourData = await tourModel.create(req.body);

    res.status(200).json({ success: true, status: 200, data: tourData });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      error: error.message,
    });
  }
};

export const retireveTours = async (req, res) => {
  try {
    const tourData = await tourModel.find();

    res.status(200).json({ success: true, status: 200, data: tourData });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      error: error.message,
    });
  }
};

export const retrievingSingleTour = async (req, res) => {
  const tourId = req.params.id;
  try {
    const tourData = await tourModel.findById(tourId);

    res.status(200).json({ success: true, status: 200, data: tourData });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      error: error.message,
    });
  }
};

// sending end-user queries through contact us form
export const sendQuery = async (req, res) => {
  const { firstName, lastName, senderEmail, message } = req.body;
  console.log("req.body: ", req.body);
  const email = "miyoshiyarou@gmail.com";
  const RecieverEmail = "miyoshiyarou@gmail.com"

  const msg = {
    to: RecieverEmail,
    from:email,
    subject: "Help center - user queries",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Query from Help Center</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          ${message}
        </p>
        <br>
        <footer style="text-align: center; color: #aaa; font-size: 0.8em;">
          <p>© 2024 Help Center. All rights reserved.</p>
        </footer>
      </div>
    `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent successfully"),
        res.status(200).json({
          success: true,
          message: "Email sent successfully",
        });
    })
    .catch((error) => {
      console.error(error.toString());
      res.status(500).json({
        success: false,
        message: "Email sending failed",
        error: error,
      });
    });
};
