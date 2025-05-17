import express, { NextFunction, Request, Response } from "express";
import bookSchema from "./bookmodel";
import createHttpError from "http-errors";
import multer from "multer";
import path from "node:path"
const bookRouter = express.Router();
bookRouter.get("/", async (req: Request, res: Response,next:NextFunction) => {
    const booksdata=bookSchema.find()
    if((await booksdata).length==0)
    {
        const error=createHttpError(404 ,"no book found")
        next(error)
    }
    else{
        res.json({
            status: true,
            message:"finded books",
            data:booksdata
        });
    }
});
const upload = multer({dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: { fileSize: 3e7 },
});

//here uploader will work as an middleware so it will be placed before the route handler and then the route handler will get exact prepared data 
bookRouter.post("/",upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1}
]) ,(req: Request, res: Response) => {
    const {title , author , file , coverImage , genre } = req.body;
    res.json("create a new book");
});

export default bookRouter;

    bookRouter.put('/',
    (req:Request ,res:Response ,next:NextFunction)=>{
    res.json({status : true , message: "update a book"})
    })