import mongoose from "mongoose";
import {user} from './usertype'
const usermodel = new mongoose.Schema<user>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.Bookusers || mongoose.model("Bookuser", usermodel);
export default User;
