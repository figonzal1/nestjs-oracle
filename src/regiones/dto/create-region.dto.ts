import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'Metropolitana' })
  @IsString()
  @MaxLength(200)
  nombre: string;
}
