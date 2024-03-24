import { Body, Controller, Post } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';

@Controller('analyze')
export class AnalyzeController {

    constructor(private readonly analyzeService: AnalyzeService) {}

    @Post('photos/game')
    async analyzeGamePhotos(
        @Body('language') language: string,
        @Body('photos') photos: string[]
    ) {
        return this.analyzeService.analyzeGamePhotosWithAnthropicSonnet(language, photos);
    }

    @Post('photos/game/gpt-vision')
    async analyzeGamePhotosWithGPTVision(
        @Body('language') language: string,
        @Body('photos') photos: string[]
    ) {
        return this.analyzeService.analyzeGamePhotosWithGPTVision(language, photos);
    }

    @Post('photos/game/anthropic-sonnet')
    async analyzeGamePhotosWithAnthropicSonnet(
        @Body('language') language: string,
        @Body('photos') photos: string[]
    ) {
        return this.analyzeService.analyzeGamePhotosWithAnthropicSonnet(language, photos);
    }

}
