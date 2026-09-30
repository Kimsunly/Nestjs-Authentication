import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'OunVenta@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password@ounventa123!!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
