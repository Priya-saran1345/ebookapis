// config/config.ts
import { config as dotenvConfig } from "dotenv";
dotenvConfig();


const _config = {
  port: process.env.PORT || 3000,
  db_url:process.env.MONGO_URL ||'', // default fallback if env is missing
  env:process.env.NODE_ENV,
  token_secret:process.env.SECRET_KEY || '',
};


export const config = Object.freeze(_config);
