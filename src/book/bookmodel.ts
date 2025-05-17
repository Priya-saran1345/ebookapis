import mongoose from "mongoose";
import { book } from "./booktype";
const booksSchema = new mongoose.Schema<book>({
title: {
    type: String,
    required: true,
},
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
genre: {
    type: String,
    required: true,
},
coverImage: {
    type: String,
    required: true,
},
file: {
    type: String,
    required: true,
},
},
{timestamps:true}
);
const bookSchema =
  mongoose.models.books || mongoose.model("books", booksSchema);
export default bookSchema;
