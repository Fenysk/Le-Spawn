import Anthropic from "@anthropic-ai/sdk";
import { Injectable, NotFoundException } from "@nestjs/common";
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

    async askToClaude(prompt: string, images: string[], model: string) {
        const imagesContent = images && images.length > 0 ? await Promise.all(images.flatMap(async (image, index) => {
            try {
                const { media_type, data } = await this.convertImageUrlToBase64(image);

                return [
                    {
                        type: "text",
                        text: `Image with id ${index + 1}:`
                    },
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type,
                            data
                        }
                    }
                ];
            } catch (error) {
                throw new Error('Error while converting image to base64');
            }
        })) : [];

        if (!imagesContent.length) throw new NotFoundException('Images not found');

        const flatImagesContent = imagesContent.flat();

        const messages: any = [
            {
                role: "user",
                content: [
                    ...flatImagesContent,
                    {
                        type: "text",
                        text: prompt
                    }
                ]
            }
        ];

        const anthropicResponse = await this.anthropic.messages.create({
            model,
            max_tokens: 1000,
            temperature: 0.5,
            system: `You're a robot that analyzes images and returns data in JSON format.`,
            messages
        })

        const gameResponse: GameResponseDto = this.jsonService.convertResponseToJSON(anthropicResponse.content[0].text);

        return gameResponse;
    }

}
