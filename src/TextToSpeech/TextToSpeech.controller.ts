import { Body, Controller, Post, Res } from '@nestjs/common';
import { TextToSpeechService } from './TextToSpeech.service';
import { TextToSpeechDto } from './TextToSpeech.dto';
import { Response } from 'express';

@Controller('TextToSpeech')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post('getURl')
  async getURl(@Body() textToSpeechDto: TextToSpeechDto, @Res() res: Response) {
    try {
      const { text, language } = textToSpeechDto;
      const url = await this.textToSpeechService.transfer(text, language);
      return res.json({ url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
