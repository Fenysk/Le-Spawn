import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GameResponseDto } from '../dto/game-response.dto';
import { JsonService } from './json.service';

@Injectable()
export class OpenAiService {

    public openAi = new OpenAI();

    constructor(
        private readonly configService: ConfigService,
        private readonly jsonService: JsonService
    ) {
        this.openAi.apiKey = this.configService.get('OPENAI_API_KEY');
    }


    async askToGPTVision(prompt: string, images: string[]): Promise<GameResponseDto> {

        console.log(images);

        const imagesContent = images ? images.map(image => {
            return {
                type: "image_url",
                image_url: image
            }
        }) : [];

        const messages: any = [
            {
                role: 'system',
                content: 'You\'re a robot that analyzes images and returns data in JSON format.'
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: prompt
                    },
                    ...imagesContent
                ]
            }
        ];

        try {
            const response = await this.openAi.chat.completions.create({
                model: 'gpt-4-vision-preview',
                max_tokens: 4096,
                messages
            });

            const message = response.choices[0].message.content;

            const gameResponse: GameResponseDto = this.jsonService.convertResponseToJSON(message);

            return gameResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
