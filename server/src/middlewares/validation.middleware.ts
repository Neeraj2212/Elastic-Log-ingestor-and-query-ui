import { HttpException } from '@exceptions/HttpException';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { RequestHandler } from 'express';

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  isArray = false,
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    const input = req[value];
    const toValidate = isArray ? input.map(obj => plainToInstance(type, obj)) : plainToInstance(type, input);
    const promises = (Array.isArray(toValidate) ? toValidate : [toValidate]).map(obj =>
      validate(obj, { skipMissingProperties, whitelist, forbidNonWhitelisted }),
    );
    Promise.all(promises).then((errors: ValidationError[][]) => {
      const flattenedErrors: ValidationError[] = [].concat(...errors);
      if (flattenedErrors.length > 0) {
        const message = flattenedErrors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
