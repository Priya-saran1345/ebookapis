import { NextFunction, Request, Response } from "express";
import path from "node:path";
import cloudinary from "../../config/cloudinary";
import fs from "node:fs";
import bookSchema from "./bookmodel";
import createHttpError from "http-errors";
import { Authrequest } from "../middleware/authentication";

export const getbook=async (req: Request, res: Response, next: NextFunction) => {
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
}

export const getsinglebook = async (req: Request, res: Response, next: NextFunction) => {
  const bookid = req.params.id;
  
    const book = await bookSchema.findById(bookid);
    console.log('the book is i',book)
    if (!book) {
      const createderror = createHttpError(404, "book not found");
      return next(createderror); // ⬅️ IMPORTANT: return here
    }
    res.json({ message: "book found", book });
  
};
function getCloudinaryPublicId(url: string, folder: string): string {
  const parts = url.split("/");
  const filename = parts[parts.length - 1].split(".")[0]; // remove .pdf or .jpg
  return `${folder}/${filename}`;
}

export const deletebook = async (req: Request, res: Response, next: NextFunction) =>{
  const bookid = req.params.id;
  const book = await bookSchema.findById(bookid);
  if (!book) {
    const createderror = createHttpError(404, "book not found");
    return next(createderror); // ⬅️ IMPORTANT: return here
  }
   const filePublicId = getCloudinaryPublicId(book.file, "book-files");
    const imagePublicId = getCloudinaryPublicId(book.coverImage, "book-covers");
    // Delete PDF
    try {
      console.log('the public id of the file is',filePublicId)
      await cloudinary.uploader.destroy(`${filePublicId}.pdf`, { resource_type: "raw" });
    } catch (error) {
      console.log("Error deleting PDF from Cloudinary:", error);
      return next(createHttpError(404, "Could not delete PDF from Cloudinary"));
    }
    // Delete Cover Image
    try {
      console.log('the public id of the image is',imagePublicId)
      await cloudinary.uploader.destroy(imagePublicId);
    } catch (error) {
      console.log("Error deleting image from Cloudinary:", error);
      return next(createHttpError(404, "Could not delete cover image from Cloudinary"));
    }
  try{
 const deletedbook=  await bookSchema.findOneAndDelete({_id:bookid})
 res.json({message:"book deleted successfully",deletedbook})
  }catch(error)
  {
    console.log(error)
    const Error=createHttpError(500 ,"unable to delete the file")
    next(Error)
  }
}



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
export const updatebook = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookid = req.params.id;
  const _req = req as Authrequest;
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const book = await bookSchema.findById(bookid);
  if (!book) {
    const error = createHttpError(404, "book not found");
    return next(error);
  }
  // if(book.author !==String(_req.author))
  // {
  //   console.log('the book author id is ',book.author)
  //   console.log('the requested author is ',_req.author)
  //   const error = createHttpError(403, "you are not the author of this book");
  //   return next(error);
  // }
    let updatedFields : any = { 
      title: req.body.title,
      genre:req.body.genre,
      author: _req.author,
    };
    // Upload coverImage if provided
    if (files?.coverImage?.[0]) {
      const coverImage_name = files.coverImage[0].filename;
      const coverImage_filepath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        coverImage_name
      );
      const coverImage_type = files.coverImage[0].mimetype.split("/").at(-1);
      const uploadResult = await cloudinary.uploader.upload(coverImage_filepath, {
        filename_override: coverImage_name,
        folder: "book-covers",
        format: coverImage_type,
      });
      updatedFields.coverImage = uploadResult.secure_url;
      await fs.promises.unlink(coverImage_filepath);
    }
    // Upload book PDF if provided
    if (files?.file?.[0]) {
      const book_pdf_name = files.file[0].filename;
      const book_pdf_filepath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        book_pdf_name
      );
      const book_pdf_type = files.file[0].mimetype.split("/").at(-1);
      const uploadResultPdf = await cloudinary.uploader.upload(book_pdf_filepath, {
        resource_type: "raw",
        filename_override: book_pdf_name,
        folder: "book-files",
        format: book_pdf_type,
      });
      updatedFields.file = uploadResultPdf.secure_url;
      await fs.promises.unlink(book_pdf_filepath);
    }
    const updatedBook = await bookSchema.findByIdAndUpdate(bookid, updatedFields, {
      new: true,
    });
    if (!updatedBook) {
      return next(createHttpError(404, "Book not found"));
    }
    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    return next(createHttpError(500, "Error while updating the book"));
  }
};
