import "dotenv/config";

export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;
export const CLIENT_URL = process.env.CLIENT_URL;
export const PORT = process.env.PORT || 4000;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const HAS_CLOUDINARY_CONFIG = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET,
);

const requiredEnvVars = {
  TOKEN_SECRET,
  MONGODB_URI,
  CLIENT_URL,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}