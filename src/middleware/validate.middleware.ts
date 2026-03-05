import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

interface ValidateSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

/**
 * Validate request body against a Zod schema (backward compatible).
 * Can also accept an object with body/params/query schemas.
 */
export const validate =
  (schema: ZodSchema | ValidateSchemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if ("parse" in schema) {
        // Single schema — validate body (legacy usage)
        schema.parse(req.body);
      } else {
        if (schema.body) schema.body.parse(req.body);
        if (schema.params) schema.params.parse(req.params);
        if (schema.query) schema.query.parse(req.query);
      }
      next();
    } catch (error: unknown) {
      const zodError = error as { errors?: { message: string; path: (string | number)[] }[] };
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: zodError.errors ?? [],
      });
    }
  };