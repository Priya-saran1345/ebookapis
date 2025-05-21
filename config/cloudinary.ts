import { v2 as cloudinary } from 'cloudinary';
import { config as conf } from './config';

cloudinary.config({ 
  cloud_name: conf.Cloudinary_clou, 
  api_key: conf.Cloudinary_api_key, 
  api_secret: conf.Cloudinary_secret
});

export default cloudinary; // ✅ export the cloudinary instance
