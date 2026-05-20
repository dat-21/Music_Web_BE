import { Request, Response, NextFunction } from "express";
import { SafeParseReturnType, ZodSchema } from "zod";
import { sendErrorResponse } from "../utils/respone.utils";

interface ValidateSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

type ValidationLocation = "body" | "params" | "query";
type ValidationIssue = {
  path: (string | number)[];
  field: string;
  location: ValidationLocation;
  message: string;
  code: string;
};

const collectIssues = (
  result: SafeParseReturnType<unknown, unknown> | undefined,
  location: ValidationLocation
): ValidationIssue[] => {
  if (!result || result.success) return [];

  return result.error.errors.map((issue) => {
    const fieldPath = issue.path.join(".");
    const field =
      location === "body"
        ? fieldPath
        : fieldPath
          ? `${location}.${fieldPath}`
          : location;

    return {
      path: issue.path,
      field,
      location,
      message: issue.message,
      code: issue.code,
    };
  });
};

const buildErrorMessage = (errors: ValidationIssue[]): string => {
  if (!errors.length) return "Validation failed";

  return errors
    .map((issue) => (issue.field ? `${issue.field}: ${issue.message}` : issue.message))
    .join("; ");
};

/**
 * Validate request body against a Zod schema (backward compatible).
 * Can also accept an object with body/params/query schemas.
 */
export const validate =
  (schema: ZodSchema | ValidateSchemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if ("parse" in schema) {
      // Single schema — validate body (legacy usage)
      const result = schema.safeParse(req.body);
      if (result.success) {
        next();
        return;
      }

      const errors = collectIssues(result, "body");
      sendErrorResponse(res, 400, buildErrorMessage(errors), { errors });
      return;
    }

    const errors = [
      ...collectIssues(schema.body?.safeParse(req.body), "body"),
      ...collectIssues(schema.params?.safeParse(req.params), "params"),
      ...collectIssues(schema.query?.safeParse(req.query), "query"),
    ];

    if (errors.length) {
      sendErrorResponse(res, 400, buildErrorMessage(errors), { errors });
      return;
    }

    next();
  };