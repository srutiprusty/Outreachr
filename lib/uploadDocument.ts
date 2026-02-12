import cloudinary from "@/lib/cloudinary";

export const uploadDocument = async (
  buffer: Buffer,
  folder: string,
  fileName?: string
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder,
        public_id: fileName ? fileName.split(".")[0] : undefined,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};
