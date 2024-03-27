import { Module } from '@nestjs/common';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { AnthropicService } from './services/anthropic.service';
import { JsonService } from './services/json.service';
import { OpenAiService } from './services/openai.service';

@Module({
    imports: [
        StatisticsModule
    ],
    controllers: [AnalyzeController],
    providers: [
        AnalyzeService,
        OpenAiService,
        AnthropicService,
        JsonService
    ]
})
export class AnalyzeModule { }
