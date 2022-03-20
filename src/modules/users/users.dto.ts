import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNumber, IsObject, IsOptional, IsString, IsUrl } from "class-validator";
import { PartialRecord } from "src/helpers/types";
import { User } from "src/models/users.model";

class Social {
  @IsUrl()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly fb: string;

  @IsUrl()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly insta: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly tg: string;

  @IsUrl()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly website: string;
}
class Location {
  @IsString()
  @ApiProperty({ example: "Armenia" })
  readonly country: string;

  @IsString()
  @ApiProperty({ example: "Yerevan" })
  readonly city: string;
}

export class UploadAvatarDto {
  @ApiProperty({ type: "file" })
  readonly avatar: any;
}

export class UpdateUser {
  @IsObject()
  @ApiProperty({ type: Location })
  readonly location: Location;

  @IsObject()
  @ApiProperty({ type: Social })
  readonly social: Social;

  @IsString()
  @ApiProperty({ example: "test user 123" })
  readonly name: string;

  @IsString()
  @ApiProperty({ example: "01231231231" })
  readonly telephone: string;
}

export const projections: Record<string, PartialRecord<keyof User, number>> = {
  base: {
    password: 0,
    privateInfo: 0,
    balance: 0,
    followers: 0,
  },
  self: {
    password: 0,
    privateInfo: 0,
    followers: 0,
  },
};

export class GetUsersByNameQuery {
  @IsArray()
  @ApiProperty({ isArray: true, type: String, example: ["teacher"] })
  readonly role: string[];

  @IsString()
  @ApiProperty({ example: "" })
  readonly name: string;

  @IsNumber()
  @ApiProperty({ example: 0 })
  readonly page: number;

  @IsNumber()
  @ApiProperty({ example: 3 })
  readonly limit: number;
}
