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
import settingRouter from "./router/setting.router.js";
import Chat from "./router/chat.route.js";
import agencyRoute from "./router/agency.router.js";
import ReviewsRoute from "./router/review.route.js";
dotenv.config();
import Referral from "./router/referral.router.js";
import SearchRouter from "./router/search.router.js";
import DiscountRouter from "./router/discount.router.js";
import transactionRouter from "./router/transaction.router.js";
import shiftRouter from "./router/shift.router.js";
import http from "http"; // Import http
import { Server } from "socket.io"; // Import Socket.IO
import { GetConversation } from "./controller/chat.controller.js";
import ConversationModel from "./model/chatConversation.model.js";
import { chatUserModel } from "./model/chatingUser.model.js";
import MessageModel from "./model/message.model.js";
import ServicesRouter from "./router/services.router.js";

const app = express();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

// ----- connecting to database -----
dbConnection(DB_URL);

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
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
app.use("/api/v1/agency", agencyRoute);
app.use("/api/v1/referral", Referral);
app.use("/api/v1/search", SearchRouter);
app.use("/api/v1/discount", DiscountRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/setting", settingRouter);
app.use("/api/v1/shift", shiftRouter);
app.use("/api/v1/services",ServicesRouter)

app.all("*", (req, res) => {
  res.status(500).json({
    status: 500,
    success: false,
    message: `Can not find ${req.originalUrl} on this server`,
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);

  socket.on("chat message", (msg) => {
    io.emit("update", { msg });
    io.emit("update", { msg });
    // io.emit('send message',msg)
    // io.emit("new message", msg);
  });

  // const users = [];

  socket.on("userStatus", async (data) => {
    try {
      const { _id } = data;
  
      // Check if user exists using userId
      let user = await chatUserModel.findOne({ userId: _id });
  
      if (user) {
        // Update existing user's details
        user = await chatUserModel.findOneAndUpdate(
          { userId: _id },
          { lastSeen: Date.now(), isActive: true, socketId: socket.id },
          { new: true }
        );
      } else {
        // Create new user if not exists
        user = await chatUserModel.create({
          userId: _id,
          isActive: true,
          lastSeen: Date.now(),
          socketId: socket.id,
        });
      }
  
      // Retrieve and emit all users' status
      const users = await chatUserModel.find();
      io.emit("status", users);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });
  
  socket.on("conversation", async ({ recipient, sender }) => {
    try {
      const conversation = await ConversationModel.findOne({
        $or: [
          { sender: sender, recipient: recipient },
          { sender: recipient, recipient: sender },
        ],
      });

      if (!conversation) {
        // socket.emit('update')
        socket.emit("conversation", {
          msg: "conversation not found",
          status: true,
          frontStatus: false,
        });
      } else {
        socket.emit("conversation", {
          status: true,
          data: conversation,
          frontStatus: true,
        });
      }
      io.emit("update", { conversation });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      socket.emit("conversation", {
        msg: "error fetching conversation",
        status: false,
      });
    }
  });

  socket.on("send message", (messageData) => {
    // console.log("Message received:", messageData);

    io.emit(messageData.recipient, messageData);
  });
  socket.on("read", async (data) => {
    const message = await MessageModel.findById(data.id);
    if (message) {
      message.status = 3;
      await message.save();
    }
    io.emit("update", message);
  });
  socket.on("disconnect", async () => {
    const user = await chatUserModel.findOne({ socketId: socket.id });
    if (user) {
      user.isActive = false;
      user.lastSeen = Date.now();
      user.socketId = socket.id;
      await user.save();
    }
    const users = await chatUserModel.find();
      io.emit("status", users);
  });
});

// -------- app listening port number ---------
server.listen(PORT, () => {
  console.log(`App listening on port: http://localhost:${PORT}`);
});
