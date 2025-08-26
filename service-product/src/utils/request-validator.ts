import { ClassConstructor, plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

const validatorError = async (
  input: any
): Promise<ValidationError[] | false> => {
  const error = await validate(input, { validationError: { target: true } });

  if (error.length > 0) return error;

  return false;
};

export const RequestValidator = async <T>(
  type: ClassConstructor<T>,
  body: any
) => {
  const input = plainToClass(type, body);

  const errors = await validatorError(input);

  if (errors) {
    const errorMessages = errors.map((e) =>
      Object.values(e.constraints || {}).join(", ")
    );

    return { errors: errorMessages, input };
  }

  return { errors: false, input };
};
