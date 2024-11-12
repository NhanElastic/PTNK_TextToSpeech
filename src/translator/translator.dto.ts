import { IsString, IsOptional } from 'class-validator';

export class TranslatorDto {
  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  fromLang: string = 'vi';

  @IsString()
  @IsOptional()
  toLang: string = 'en';
}
