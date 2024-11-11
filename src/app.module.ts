import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextToSpeechModule } from './TextToSpeech/TextToSpeech.module';
import { TextToSpeechController } from './TextToSpeech/TextToSpeech.controller';

@Module({
  imports: [TextToSpeechModule],
  controllers: [AppController, TextToSpeechController],
  providers: [AppService],
})
export class AppModule {}
