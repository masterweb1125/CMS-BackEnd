import stripePackage from "stripe";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);


export const stripe_checkout = async (req, res) => {
  console.log("req.body: ", req.body);

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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });
    return res.status(200).json({
      status: 200,
      success: true,
      id: session.id,
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
