import { Module } from '@nestjs/common';
import { TextToSpeechService } from './TextToSpeech.service';
import { TextToSpeechController } from './TextToSpeech.controller';

@Module({
  imports: [],
  providers: [TextToSpeechService],
  controllers: [TextToSpeechController],
  exports: [TextToSpeechService],
})
export class TextToSpeechModule {}
