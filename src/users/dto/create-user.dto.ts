import { IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}
