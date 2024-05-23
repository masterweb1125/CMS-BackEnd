import {  tourModel } from "../model/booking.model.js";
tourModel


export const createTour = async (req, res) => {
    console.log("req.body: ", req.body)
    
    try {
        const tourData = await tourModel.create(req.body);

        res.status(200).json({ success: true, status: 200, data: tourData });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: error.message
        })
    }
}


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