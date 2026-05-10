import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; public_id?: string } = {}
) {
  return new Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    blur_url?: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder ?? "portfolio",
        public_id: options.public_id,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export function getBlurDataURL(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 10, quality: 1, fetch_format: "auto" },
    ],
    secure: true,
  });
}
