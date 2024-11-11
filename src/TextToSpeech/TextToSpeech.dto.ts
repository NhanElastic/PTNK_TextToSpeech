import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class TextToSpeechDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  language: string = 'en';
}
