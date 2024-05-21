import { bookingModel } from "../model/booking.model";


export const createTour = async (req, res) => {

    try {
        const tourData = await bookingModel.create(req.body);

        res.status(200).json({ success: true, status: 200, data: tourData });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: error.message
        })
    }
}