import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

const bufferToStream = (buffer: Buffer): Readable => {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
};

export const uploadToCloudinary = (
    buffer: Buffer,
    options: any
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        bufferToStream(buffer).pipe(uploadStream);
    });
};