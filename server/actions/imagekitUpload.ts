import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

interface UploadImageKitProps {
  url: string | Buffer; // Base64 string or file path
  fileName: string; // Name of the file to be uploaded
  folder?: string; // Optional folder path in ImageKit

}
// Example: Upload a file from base64 string or file path
export const uploadImageKit = async ({ url, fileName, folder }: UploadImageKitProps): Promise<string> => {
  try {
    const response = await imagekit.upload({
      file: url, // or you can use a local file path like "./test.jpg"
      fileName,
      folder,
    });
    return response.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
}
