import { Request, Response } from "express";
import { sendResponse } from "../utils/respone.utils";
import {
    getPersonalizedRecommendations,
    getGeneralRecommendations, 
} from "../services";
import { asyncHandler } from "../utils/asyncHandler.utils";

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  
        if (req.user) {
            const data = await getPersonalizedRecommendations(req.user.username);
            sendResponse(res, 200, {
                message: "Personalized recommendations",
                data,
            });
        } else {
            const data = await getGeneralRecommendations();
            sendResponse(res, 200, {
                message: "General recommendations",
                data,
            });
        }
   
});