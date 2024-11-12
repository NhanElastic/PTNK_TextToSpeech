import { Body, Controller, Post, Res } from '@nestjs/common';
import { TranslatorService } from './translator.service';
import { Response } from 'express';
import { TranslatorDto } from './translator.dto';

@Controller('translator')
export class TranslatorController {
  constructor(private translatorService: TranslatorService) {}

  @Post('translate')
  async translate(@Body() translator: TranslatorDto, @Res() res: Response) {
    try {
      const { text, fromLang, toLang } = translator;
      if (!text) return res.json({ textTranslated: '' });
      const textTranslated = await this.translatorService.translateText(
        text,
        fromLang,
        toLang,
      );
      return res.json({ textTranslated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
