import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoString = process.env.MONGODB_CONNECTION_STRING;

try {
  mongoose.connect(mongoString).then(()=> {
    console.log("connected")
  })
} catch (error) {
  console.log(error)
}