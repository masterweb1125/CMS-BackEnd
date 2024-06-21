import stripePackage from "stripe";
import { createBooking } from "./booking.controller.js";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);


export const stripe_checkout = async (req, res) => {
  // console.log("req.body: ", req.body);

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        unit_amount: Math.round(req.body.amount * 100),
        product_data: {
          name: "book your residence", 
        },
      },
      quantity: 1,
    },
  ];
    
    try {
      // console.log('req body',req.body)
      const bookingData = {...req.body.data,confirm:true}
      // console.log('booking variale',bookingData)
      const successUrl = `http://localhost:3000/success?data=${encodeURIComponent(JSON.stringify(bookingData))}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: "http://localhost:3000/cancel",
      });
      // console.log(session)
    // await  createBooking(req.body.data,res)
    return res.status(200).json({
      status: 200,
      success: true,
      id: session.id,
      data:session
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
        message: "something went wrong",
      error: error.message
    });
  }
};
