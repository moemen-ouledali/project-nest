import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsBoolean()
  available: boolean;

  @IsString()
  @IsNotEmpty()
  date: string;
}
