import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUsernameConstraint implements ValidatorConstraintInterface {
  validate(username: string): boolean {
    // Vérifie si la chaîne respecte les conditions
    const regex = /^[a-zA-Z0-9_<>\-]{1,20}$/;
    return typeof username === 'string' && regex.test(username);
  }

  defaultMessage(): string {
    return "Le nom d'utilisateur est invalide. Il doit contenir uniquement des caractères alphanumériques ou les caractères spéciaux '_', '-', '<', '>', et ne doit pas dépasser 20 caractères.";
  }
}

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameConstraint,
    });
  };
}