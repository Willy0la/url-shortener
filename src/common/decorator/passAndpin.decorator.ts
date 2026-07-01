import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'notBoth' })
export class NotBothPasswordAndPin implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const dto = args.object as any;
    return !(dto.password && dto.pinCode);
  }
  defaultMessage() {
    return 'Provide either password or PIN — not both';
  }
}
