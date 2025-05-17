import createHttpError from "http-errors";
import { sign } from "jsonwebtoken";
import { config } from "../../config/config";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import User from "./usermodel";
  const loginuser =async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }
    try {
      const finded_user = await User.findOne({ email });
      if (finded_user) {
const isvalidPassword = await bcrypt.compare(password, finded_user.password);
        if (!isvalidPassword) {
          const error = createHttpError(400, "Invalid password");
          return next(error);
        } else {
            const token = sign({ id: finded_user._id }, config.token_secret)
            res.status(200).json({ message: "User logged in successfully", data: { token}})
        }
      } else {
        const error = createHttpError(404, "user not found ");
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  }
  export default loginuser