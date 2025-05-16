import express from "express";
const app=express()






app.get('/',(req,res)=>{
    res.json({message:'hello world'})
})
// app.post('/' ,(req,res)=>{
//     res.send('hello world from post request')
// })






















export default app;