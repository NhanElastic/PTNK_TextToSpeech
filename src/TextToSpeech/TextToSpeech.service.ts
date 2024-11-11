import { Injectable } from '@nestjs/common';
import * as googleTTS from 'google-tts-api';

@Injectable()
export class TextToSpeechService {
  async transfer(text: string, language: string = 'en') {
    try {
      return googleTTS.getAudioUrl(text, {
        lang: language,
        slow: false,
        host: 'https://translate.google.com',
      });
    } catch (error) {
      throw new Error(`Failed to translate text: ${error.message}`);
    }
  }
}
