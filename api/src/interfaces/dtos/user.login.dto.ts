import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'example@domain.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    minLength: 6,
    example: 'password',
  })
  @IsString()
  password: string;
}
