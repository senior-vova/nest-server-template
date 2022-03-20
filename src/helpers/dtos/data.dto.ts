import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ default: 0 })
  readonly page?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ default: 10 })
  readonly limit?: number;
}

export class SortDto {
  @IsString()
  @ApiProperty()
  sortBy: string;

  @IsString()
  @IsIn(["asc", "desc", ""])
  @ApiProperty()
  orderBy: string;
}

export class SortAndPaginationDto extends SortDto {
  @IsNumber()
  @ApiProperty()
  readonly page: number;

  @IsNumber()
  @ApiProperty()
  readonly limit: number;
}
