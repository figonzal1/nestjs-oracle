import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateSenadorDto {
  @ApiProperty({ example: 'Ada Lovelace' })
  @IsString()
  @MaxLength(200)
  nombre: string;

  @ApiProperty({ example: 'Independiente' })
  @IsString()
  @MaxLength(200)
  partido: string;

  @ApiProperty({ example: 1, description: 'ID de una región existente (ver GET /regiones)' })
  @IsInt()
  regionId: number;
}
