import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: string): boolean {
    // Vérifie si le numéro commence par "06" ou "07" et est suivi de 8 chiffres
    const phoneRegex = /^(0)\d{9}$/;
    return typeof phoneNumber === 'string' && phoneRegex.test(phoneNumber);
  }

  defaultMessage(): string {
    return 'Le numéro de téléphone doit être un string de 10 chiffres commençant par "06" ou "07".';
  }
}

export function CustomIsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}
