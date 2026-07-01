import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumberString,
  Length,
  ValidateIf,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotBothPasswordAndPin } from 'src/common/decorator/passAndpin.decorator';
import RequiresOneOf from 'src/common/decorator/requireOneOf.decorator';

export class SignInDto {
  @ApiProperty({ example: 'johndoe12' })
  @Validate(NotBothPasswordAndPin)
  @RequiresOneOf('password', 'pinCode')
  @IsString()
  @IsNotEmpty({ message: 'Identifier is required' })
  identifier!: string;

  @ApiProperty({ example: 'Password123', required: false })
  @ValidateIf((o) => o.password !== undefined)
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;

  @ApiProperty({ example: '1234', required: false })
  @ValidateIf((o) => o.pinCode !== undefined)
  @IsNumberString({}, { message: 'PIN must contain only numbers' })
  @Length(4, 6, { message: 'PIN must be between 4 and 6 digits' })
  pinCode?: string;
}
