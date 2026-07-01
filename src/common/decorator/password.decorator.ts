import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchfield' })
export class MatchField implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedField] = args.constraints;
    return value === (args.object as any)[relatedField];
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}
