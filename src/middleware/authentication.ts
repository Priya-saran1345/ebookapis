import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../../config/config";
// import { JwtPayload } from "jsonwebtoken";
export interface Authrequest extends Request{
    author:string
}
export const userauthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization"); // fix typo: 'Autherization' -> 'Authorization'
    if (!authHeader) {
      return next(
        createHttpError(400, "No token found in Authorization header")
      );
    }
    console.log("the token is", authHeader);

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(createHttpError(401, "Invalid token format"));
    }

    const decoded = verify(token, config.token_secret as string);
    console.log("the decoded token is ", decoded);
    // Optionally attach the decoded user info to the request
if (typeof decoded === "object" && "id" in decoded) {
  const _req = req as Authrequest;
  _req.author = decoded.id as string;
  next();
} else {
  return next(createHttpError(401, "Invalid token payload"));
}
  } catch (err) {
    console.log(err);
    return next(createHttpError(401, "Invalid or expired token"));
  }
};
