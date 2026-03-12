import { v2 as cloudinary } from "cloudinary";

// configure with environment variables (ensure these are set in your .env or deployment environment)
cloudinary.config({
  // trim values in case .env has extra spaces
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

export default cloudinary;
