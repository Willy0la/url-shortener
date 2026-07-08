import { ApiProperty } from '@nestjs/swagger';
import {
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://facebook.com',
    description: 'The target long URL to redirect to',
  })
  @IsUrl({}, { message: 'originalUrl must be a valid URL string' })
  @IsNotEmpty()
  originalUrl!: string;

  @ApiProperty({
    example: 'my-brand',
    description: 'Optional custom short code',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  customCode?: string;

  @ApiProperty({
    example: '2026-12-31',
    description: 'Optional expiry date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'expiresAt must be a valid date string' })
  expiresAt?: string;
}
