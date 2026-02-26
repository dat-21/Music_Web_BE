import { parseBuffer } from "music-metadata";

export const getAudioDuration = async (
    buffer: Buffer,
    mimeType: string
): Promise<number> => {
    try {
        const metadata = await parseBuffer(buffer, { mimeType });
        return Math.floor(metadata.format.duration || 0);
    } catch {
        return 0;
    }
};