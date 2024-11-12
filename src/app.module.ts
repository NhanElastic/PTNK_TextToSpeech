import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextToSpeechModule } from './TextToSpeech/TextToSpeech.module';
import { TextToSpeechController } from './TextToSpeech/TextToSpeech.controller';
import { TranslatorModule } from './translator/translator.module';
import { TranslatorController } from './translator/translator.controller';

@Module({
  imports: [TextToSpeechModule, TranslatorModule],
  controllers: [AppController, TextToSpeechController, TranslatorController],
  providers: [AppService],
})
export class AppModule {}
