import mongoose from "mongoose";

export const dbConnection = (DB_URL) => {
  mongoose.set("strictQuery", true);
  
    mongoose.connect(DB_URL, {
        autoIndex: true,
      })
      .then(() => {
        console.log("Database Connected Successfuly.");
      })
      .catch((err) => {
        console.log(err);
      });
}