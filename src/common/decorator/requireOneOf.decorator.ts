import { registerDecorator, ValidationArguments } from 'class-validator';

export default function RequiresOneOf(...targetFields: string[]) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'requiresOneOf',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as any;

          const isPopulated = (val: any) =>
            val !== undefined && val !== null && val !== '';

          if (!isPopulated(value)) {
            return true;
          }

          return targetFields.some((field) => isPopulated(dto[field]));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} requires at least one of these accompanying fields: ${targetFields.join(', ')}`;
        },
      },
    });
  };
}
