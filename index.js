import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import authRouter from "./router/auth.route.js";
import { dbConnection } from "./db/connect.js";
import paymentRouter from "./router/payment.route.js";
import adminRouter from "./router/admin.route.js";
import supplierRouter from "./router/supplier.route.js";
import tourRouter from "./router/tour.route.js";
import blogRouter from "./router/blog.route.js";
import cookieParser from "cookie-parser";
import bookingRouter from "./router/booking.route.js";
import Chat from "./router/chat.route.js";
import agencyRoute from "./router/agency.router.js";
import ReviewsRoute from "./router/review.route.js"

dotenv.config();
const app = express();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

// ----- connecting to database -----
dbConnection(DB_URL);
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// ---- Error handling middleware -----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    success: false,
    message: err.message,
  });
});


// ---- Default/home page route --------
app.get("/", (req, res) => {
  res.send("WELCOME TO THE 'CMS-TOUR PROJECT SERVER 👋");
});

// ------ Custom middlewares --------- 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/supplier", supplierRouter);
app.use("/api/v1/agency", agencyRoute);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/tour", tourRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/chat", Chat);
app.use("/api/v1/reviews", ReviewsRoute);
app.use('/api/v1/agency',agencyRoute)
// app.get('/api/v1/booking/totalRevenue',async()=>{
//   console.log(object)
// })


// ----- Errors handler ------
app.all("*", (req, res) => {
  res.status(500).json({
    status: 500,
    success: false,
    message: `Can not find ${req.originalUrl} on this server`,
  });
});

// -------- app listening port number ---------
app.listen(PORT, () => {
  console.log(`App listening on port: http:localhost:${PORT}`);
})