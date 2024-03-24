import Anthropic from "@anthropic-ai/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios from "axios";
import { GameResponseDto } from "../dto/game-response.dto";
import { JsonService } from "./json.service";

@Injectable()
export class AnthropicService {
    public anthropic = new Anthropic()

    constructor(
        private readonly configService: ConfigService,
        private readonly jsonService: JsonService
    ) {
        this.anthropic.apiKey = this.configService.get('ANTHROPIC_API_KEY');
    }

    private async convertImageUrlToBase64(imageUrl: string): Promise<{ media_type: string; data: string }> {

        try {
            const response = await Axios.get(imageUrl, {
                responseType: 'arraybuffer', // Important to get the response as an array buffer
            });

            // Extract media type from the response headers
            const media_type = response.headers['content-type'];

            // Convert buffer to Base64
            const base64 = Buffer.from(response.data, 'binary').toString('base64');

            return { media_type, data: base64 };
        } catch (error) {
            console.error(error);
            throw new Error('Error while converting image to base64');
        }

    }

    async askToSonnet(prompt: string, images: string[]) {
        const imagesContent = images && images.length > 0 ? await Promise.all(images.map(async (image) => {

            const { media_type, data } = await this.convertImageUrlToBase64(image);

            return {
                type: "image",
                source: {
                    type: "base64",
                    media_type,
                    data
                }
            };
        })) : [];

        const messages: any = [
            {
                role: "user",
                content: [
                    ...imagesContent,
                    {
                        type: "text",
                        text: prompt
                    }
                ]
            }
        ];

        const anthropicResponse = await this.anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            temperature: 0.5,
            system: `You're a robot that analyzes images and returns data in JSON format.`,
            messages
        })

        const gameResponse: GameResponseDto = this.jsonService.convertResponseToJSON(anthropicResponse.content[0].text);

        return gameResponse;
    }

}