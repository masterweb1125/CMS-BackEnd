import mongoose from "mongoose";

export const dbConnection = async (DB_URL) => {
  mongoose.set("strictQuery", true);
  
 await   mongoose.connect(DB_URL, {
        autoIndex: true,
      })
      .then(() => {
        console.log("Database Connected Successfuly.");
      })
      .catch((err) => {
        console.log(err);
      });
}
