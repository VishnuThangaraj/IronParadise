import type { Request, Response, NextFunction } from "express";

import type { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const flattened = result.error.flatten();
      const firstError =
        flattened.formErrors[0] ||
        Object.values(flattened.fieldErrors).flat()[0] ||
        "Validation failed";

      return res.status(400).json({
        success: false,
        message: firstError,
        errors: flattened,
      });
    }

    req.body = result.data;

    next();
  };
}
