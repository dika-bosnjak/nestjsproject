import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false })
  middleName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  county: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  apartment: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  zip: string;
}
