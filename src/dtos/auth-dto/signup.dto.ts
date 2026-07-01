import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { MatchField } from 'src/common/decorator/password.decorator';

export class SignUpDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ description: 'Unique username', example: 'johndoe12' })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  userName!: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Must be at least 8 characters and contain both letters and numbers',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Must match the password field',
  })
  @Validate(MatchField, ['password'])
  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword!: string;

  @ApiProperty({ description: '4-digit transaction pin', example: '1236' })
  @IsNumberString({}, { message: 'PinCode must contain only numbers' })
  @MinLength(4, { message: 'PinCode must be exactly 4 digits' })
  @MaxLength(4, { message: 'PinCode must be exactly 4 digits' })
  @IsNotEmpty({ message: 'PinCode cannot be empty' })
  pinCode!: string;

  @ApiProperty({ description: 'Must match the pinCode field', example: '1236' })
  @Validate(MatchField, ['pinCode'])
  @IsNumberString({}, { message: 'PinCode must contain only numbers' })
  @MaxLength(4, { message: 'PinCode must be exactly 4 digits' })
  @IsNotEmpty({ message: 'Confirm PinCode cannot be empty' })
  confirmPinCode!: string;

  @ApiProperty({
    description: 'Nigerian phone number',
    example: '+2348012345678',
  })
  @IsPhoneNumber('NG', { message: 'Must be a valid Nigerian phone number' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber!: string;
}
