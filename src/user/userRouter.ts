import express  from "express";
// import createHttpError from "http-errors";
const userRouter = express.Router();
// import user from "./usermodel";
// import { sign } from "jsonwebtoken";
// import { config } from "../../config/config";
// import { user as usertype} from "./usertype";
import loginuser from './loginuser'
import signup from './signupuser'
userRouter.post(
  "/signup",signup
);
userRouter.post(
  "/login",loginuser
);

export default userRouter;
