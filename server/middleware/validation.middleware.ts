import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { ErrorConstructor } from "../utils/ResHelper";

export function validationMiddleware(type: any, isArray = false): any {
  return async (req: Request, res: Response, next: NextFunction) => {
    let objects: any[];

    if (isArray && !Array.isArray(req.body)) {
      const response = new ErrorConstructor("validation error", false, 400, ["Accepted Array Body"]);
      return res.status(response.statusCode).send(response);
    }

    if (Array.isArray(req.body)) {
      if (req.body.length === 0) {
        const response = new ErrorConstructor("validation error", false, 400, ["Array can't be empty"]);
        return res.status(response.statusCode).send(response);
      }
      objects = req.body.map((item: any) => plainToInstance(type, item));
    } else {
      objects = [plainToInstance(type, req.body)];
    }

    const validationPromises = objects.map((object: any) => validate(object));
    const results = await Promise.all(validationPromises);

    const errors: ValidationError[] = results.flatMap((result: ValidationError[]) => result);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => Object.values(error.constraints || {})).flat();
      const response = new ErrorConstructor("validation error", false, 400, errorMessages);
      return res.status(response.statusCode).send(response);
    }

    req.body = Array.isArray(req.body) ? objects : objects[0];
    next();
  };
}
