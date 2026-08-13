import { PartialType } from '@nestjs/mapped-types';
import { CreateSenadorDto } from './create-senador.dto';

export class UpdateSenadorDto extends PartialType(CreateSenadorDto) {}
