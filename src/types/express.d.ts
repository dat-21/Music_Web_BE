import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
                email: string;
                role: string;
                isVerified: boolean;
            };
            files?:
                | { [fieldname: string]: Express.Multer.File[] }
                | Express.Multer.File[];
        }
    }
}

export {};