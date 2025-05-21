import { NextFunction, Request, Response } from "express";
import path from "node:path";
import cloudinary from "../../config/cloudinary";
import fs from "node:fs";
import bookSchema from "./bookmodel";
import createHttpError from "http-errors";
import { Authrequest } from "../middleware/authentication";
export const addbook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("file i received", req.body);
  console.log("Files received:", req.files);

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log("the files are ", files);
    const coverImage_name = files.coverImage[0]?.filename;
    const coverImage_filepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      coverImage_name
    );
    const coverImage_type = files.coverImage[0]?.mimetype.split("/").at(-1); // ✅ 'image/png' → 'png'
    console.log("coverimage bname", coverImage_name);
    console.log("coverimage coverImage_filepath", coverImage_filepath);
    console.log("coverimage coverImage_type", coverImage_type);
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(coverImage_filepath, {
      filename_override: coverImage_name,
      folder: "book-covers",
      format: coverImage_type,
    });
    //   console.log("uploaded result is", uploadResult);
    const book_pdf_name = files?.file[0]?.filename;
    const book_pdf_filepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      book_pdf_name
    );
    const book_pdf_type = files?.file[0]?.mimetype.split("/").at(-1);
    const uploadResultPdf = await cloudinary.uploader.upload(
      book_pdf_filepath,
      {
        resource_type: "raw",
        filename_override: book_pdf_name,
        folder: "book-files",
        format: book_pdf_type,
      }
    );
    const _req = req as Authrequest;
    const newbook = new bookSchema({
      title: req.body.title,
      author: _req.author,
      genre: req.body.genre,
      coverImage: uploadResult.secure_url,
      file: uploadResultPdf.secure_url,
    });
    const newsavedbook = await newbook.save();
    fs.promises.unlink(coverImage_filepath);
    fs.promises.unlink(book_pdf_filepath);
    res.json({ message: "book created successfully", newsavedbook });
  } catch (error) {
    console.log(error);
    const error1 = createHttpError(500, "error while uploading the files");
    return next(error1);
  }
};
