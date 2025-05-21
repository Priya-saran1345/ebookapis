import express  from "express";
import multer from "multer";
import path from "node:path";
const bookRouter = express.Router();
import { userauthentication } from "../middleware/authentication";
import { addbook ,getbook ,getsinglebook,deletebook, updatebook } from "./bookcontroler";
// import cloudinary from "../../config/cloudinary";
// import fs from "node:fs";
bookRouter.get("/",getbook );
bookRouter.get("/:id",getsinglebook)
bookRouter.delete("/:id",deletebook)


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
 bookRouter.patch(
  "/:id",
  userauthentication,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updatebook
);
export default bookRouter;
