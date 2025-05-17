import {user} from '../user/usertype'
export interface book{
    _id: string,
    title: string;
    author:user,
    genre:string,
    coverImage:string,
   file :string,
   createdAt:Date,
   updatedAt:Date
}