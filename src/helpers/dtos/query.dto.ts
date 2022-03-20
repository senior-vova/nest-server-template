import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class PaginationQuery {
  @IsNumberString()
  @ApiProperty()
  readonly page: string;

  @IsNumberString()
  @ApiProperty()
  readonly limit: string;
}

export class SortQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  orderBy: string;
}
