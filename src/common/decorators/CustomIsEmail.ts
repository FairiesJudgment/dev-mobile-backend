import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, isEmail } from 'class-validator';

@ValidatorConstraint({ async: false })
export class CustomIsEmailConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    return typeof value === 'string' && isEmail(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return "Format d'email invalide";
  }
}

export function CustomIsEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomIsEmailConstraint,
    });
  };
}
