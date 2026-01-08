import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  capacity?: number;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  date?: string;
}
