import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
const userRouter = express.Router();
import user from "./usermodel";
import bcrypt from "bcryptjs";
import { sign} from "jsonwebtoken";
import { config } from "../../config/config";
// import { user as usertype} from "./usertype";
userRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next(createHttpError(400, "All fields are required"));
    }
    try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
        return next(createHttpError(400, "User with this email already exists"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new user({
        name: username,
        email,
        password: hashedPassword,
    });
      await newUser.save(); // ✅ This saves to MongoDB
    const token = sign({id:newUser._id},config.token_secret ,{expiresIn:"7d"})
    res.status(201).json({
        message: "User created successfully",
        data: {
        _id:newUser._id,
        token,
        name: username,
        email,
          password: hashedPassword, // ✅ This is the hashed password
        },
    });
    } catch (error) {
    next(error);
    }
  }
);

export default userRouter;
