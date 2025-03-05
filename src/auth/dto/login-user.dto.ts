import { IsString } from 'class-validator';

export class loginUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
