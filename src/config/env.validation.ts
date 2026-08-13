import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  ORACLE_CONNECT_STRING: string;

  @IsString()
  @IsNotEmpty()
  ORACLE_USER: string;

  @IsString()
  @IsNotEmpty()
  ORACLE_PASSWORD: string;

  @IsNumber()
  PORT: number = 3000;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Configuración de entorno inválida: ${errors.toString()}`);
  }
  return validatedConfig;
}
