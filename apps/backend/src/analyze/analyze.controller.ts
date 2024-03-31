import { Body, Controller, Post } from '@nestjs/common';
import { StatType } from 'src/statistics/enums/stat-type.enum';
import { StatisticsService } from 'src/statistics/statistics.service';
import { GetUser } from 'src/users/decorator';
import { AnalyzeService } from './analyze.service';

@Controller('analyze')
export class AnalyzeController {

    constructor(
        private readonly analyzeService: AnalyzeService,
        private readonly statisticsService: StatisticsService
    ) { }

    @Post('photos/game/anthropic-sonnet')
    async analyzeGamePhotosWithAnthropicSonnet(
        @GetUser('sub') userId: string,
        @Body('language') language: string,
        @Body('photos') photos: string[]
    ) {
        const response = await this.analyzeService.analyzeGamePhotosWithAnthropic(language, photos, 'claude-3-sonnet-20240229');

        await this.statisticsService.addNewStatistic({ type: StatType.AI_USAGE, value: response.usage.total_cost_in_cents }, userId);

        return response;
    }

    @Post('photos/game/anthropic-haiku')
    async analyzeGamePhotosWithAnthropicHaiku(
        @GetUser('sub') userId: string,
        @Body('language') language: string,
        @Body('photos') photos: string[]
    ) {
        const response = await this.analyzeService.analyzeGamePhotosWithAnthropic(language, photos, 'claude-3-haiku-20240307');

        await this.statisticsService.addNewStatistic({ type: StatType.AI_USAGE, value: response.usage.total_cost_in_cents }, userId);

        return response.gameResponse;
    }

}
