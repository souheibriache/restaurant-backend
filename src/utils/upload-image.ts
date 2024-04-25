import cloudinary from "cloudinary";
export const uploadImage = async (
  image: Express.Multer.File
): Promise<string> => {
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataUri = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);
  return uploadResponse.url;
};
