import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class LoginUserResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'user_login_success' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        uid: 'uid',
        email: 'email',
        full_name: 'user full name',
      },
      token: 'ey...',
    },
    nullable: true,
  })
  data: {
    user: UserDTO | null;
    token: string;
  };

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
