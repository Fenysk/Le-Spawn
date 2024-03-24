import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { OpenAiService } from './services/openai.service';
import OpenAI from 'openai';
import { AnthropicService } from './services/anthropic.service';
import { JsonService } from './services/json.service';

@Module({
  imports: [OpenAI],
  controllers: [AnalyzeController],
  providers: [
    AnalyzeService,
    OpenAiService,
    AnthropicService,
    JsonService
  ]
})
export class AnalyzeModule { }
