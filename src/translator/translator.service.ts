import { Injectable } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';

@Injectable()
export class TranslatorService {
  async translateText(
    text: string,
    fromLang: string = 'vi',
    toLang: string = 'en',
  ): Promise<string> {
    try {
      const result = await translate(text, { from: fromLang, to: toLang });
      return result.text;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
