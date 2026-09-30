import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Oun Venta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'OunVenta@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password@ounventa123!!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
