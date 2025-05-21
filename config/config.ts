// config/config.ts
import { config as dotenvConfig } from "dotenv";
dotenvConfig();


const _config = {
  port: process.env.PORT || 3000,
  db_url:process.env.MONGO_URL ||'', // default fallback if env is missing
  env:process.env.NODE_ENV,
  token_secret:process.env.SECRET_KEY || '',
  Cloudinary_secret:process.env.Cloudinary_secret||'',
  Cloudinary_api_key:process.env.Cloudinary_api_key||'',
  Cloudinary_clou:process.env.Cloudinary_clou||''
};


export const config = Object.freeze(_config);
