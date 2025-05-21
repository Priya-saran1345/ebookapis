import express, { NextFunction, Request, Response } from "express";
import bookSchema from "./bookmodel";
import createHttpError from "http-errors";
import multer from "multer";
import path from "node:path";
const bookRouter = express.Router();
import { userauthentication } from "../middleware/authentication";
import { addbook } from "./bookcontroler";
// import cloudinary from "../../config/cloudinary";
// import fs from "node:fs";
bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try{
    const books = await bookSchema.find();
    res.json(books);
  }
  catch(error)
  {
console.log(error)
const createderror=createHttpError(500 ,"unable to find books")
next(createderror)
  }
});
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30MB
});
//here uploader will work as an middleware so it will be placed before the route handler and then the route handler will get exact prepared data
  bookRouter.post(
  "/",
  userauthentication,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addbook
);
export default bookRouter;
