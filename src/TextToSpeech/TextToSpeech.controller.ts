import { Body, Controller, Post, Res } from '@nestjs/common';
import { TextToSpeechService } from './TextToSpeech.service';
import { TextToSpeechDto } from './TextToSpeech.dto';
import { Response } from 'express';

@Controller('tts')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post('get_url')
  async getURl(@Body() textToSpeechDto: TextToSpeechDto, @Res() res: Response) {
    try {
      const { text, language } = textToSpeechDto;
      console.log(textToSpeechDto);
      return this.textToSpeechService.transfer(text, language);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
