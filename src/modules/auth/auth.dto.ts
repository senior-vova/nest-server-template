import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class EmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}

export class LoginDto extends EmailDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @ApiProperty()
  password: string;
}

export class RegisterDto extends EmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Yura" })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @ApiProperty()
  readonly password: string;
}

export class ConfirmCodeDto extends EmailDto {
  @IsNumber()
  @ApiProperty()
  code: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @ApiProperty()
  password: string;
}

export class CodeDto extends EmailDto {
  @IsNumber()
  @ApiProperty()
  code: number;
}

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}
