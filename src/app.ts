    import express from "express";
    // import createHttpError from "http-errors";
    import globalErroHandler from "./middleware/globalerror";
    import userRouter from "./user/userRouter";
    import bookRouter from "./book/bookRoute";
    const app=express()
    app.get('/',(req,res )=>{
    // const error= createHttpError ({status:500,message:"something went wrong"})
    // throw error;
    // next(error)
    res.json({message:'hello world'}) 
    })
    app.use(express.json());
    app.use("/api/users",userRouter)
    app.use("/api/book",bookRouter)
    app.use(express.urlencoded({ extended: true }));

    app.use(globalErroHandler);
    export default app;