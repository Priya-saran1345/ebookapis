import express, { NextFunction, Request, Response } from "express";
import bookSchema from "./bookmodel";
import createHttpError from "http-errors";
import multer from "multer";
import path from "node:path";
const bookRouter = express.Router();
import cloudinary from "../../config/cloudinary";
bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const booksdata = bookSchema.find();
  if ((await booksdata).length == 0) {
    const error = createHttpError(404, "no book found");
    next(error);
  } else {
    res.json({
      status: true,
      message: "finded books",
      data: booksdata,
    });
  }
});











const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30MB
});
//here uploader will work as an middleware so it will be placed before the route handler and then the route handler will get exact prepared data
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    console.log("file i received", req.body);
    console.log("Files received:", req.files);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
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
    console.log("uploaded result is", uploadResult);
  
    const book_pdf_name=files?.file[0]?.filename
    const book_pdf_filepath=path.resolve(__dirname ,"../../public/data/uploads",book_pdf_name)
    const book_pdf_type=files?.file[0]?.mimetype.split("/").at(-1)
    const uploadResultPdf = await cloudinary.uploader.upload(book_pdf_filepath, {
      resource_type:"raw",
      filename_override: book_pdf_name,
      folder: "book-files",
      format: book_pdf_type,
    });
    console.log("uploaded result is of pdf is ", uploadResultPdf);


    // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });

    // console.log(optimizeUrl);

    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });

    // console.log(autoCropUrl);
    res.json("create a new book");
  }
);
export default bookRouter;

