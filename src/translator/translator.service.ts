import { Injectable } from '@nestjs/common';
import translate from 'google-translate-free';

@Injectable()
export class TranslatorService {
  async translateText(
    text: string,
    fromLang: string = 'vi',
    toLang: string = 'en',
  ) {
    try {
      const result = await translate(text, {
        from: fromLang,
        to: toLang,
      });
      return result.text;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
