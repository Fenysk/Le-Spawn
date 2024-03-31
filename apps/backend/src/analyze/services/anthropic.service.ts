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
        private readonly jsonService: JsonService,
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

    private getTokensUsage(model: string, inputTokens: number, outputTokens: number) {

        let input_pricing_in_cents = 0;
        let output_pricing_in_cents = 0;

        if (model.includes("haiku")) {
            input_pricing_in_cents = this.configService.get('HAIKU_PRICING_PER_MILLION_INPUT');
            output_pricing_in_cents = this.configService.get('HAIKU_PRICING_PER_MILLION_OUTPUT');
        }
        
        const input_cost_in_cents = input_pricing_in_cents * inputTokens / 1e6;
        const output_cost_in_cents = output_pricing_in_cents * outputTokens / 1e6;

        const total_cost_in_cents = input_cost_in_cents + output_cost_in_cents;

        return { total_cost_in_cents, input_cost_in_cents, output_cost_in_cents };
    }


    async askToClaude(prompt: string, images: string[], model: string) {
        const imagesBase64: string[] = [];

        const imagesContent = images && images.length > 0 ? await Promise.all(images.flatMap(async (image, index) => {
            try {
                const { media_type, data } = await this.convertImageUrlToBase64(image);

                imagesBase64.push(`data:${media_type};base64,${data}`);

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
            max_tokens: 2000,
            temperature: 0.6,
            system: `You're a robot that analyzes images and returns data in JSON format.`,
            messages
        })

        const anthropicResponseContent = anthropicResponse.content[0].text;
        const anthropicResponseModel = anthropicResponse.model;
        const anthropicResponseInputTokens = anthropicResponse.usage.input_tokens;
        const anthropicResponseOutputTokens = anthropicResponse.usage.output_tokens;

        const usage = this.getTokensUsage(anthropicResponseModel, anthropicResponseInputTokens, anthropicResponseOutputTokens);
        const gameResponse: GameResponseDto = this.jsonService.convertResponseToJSON(anthropicResponseContent);

        return { gameResponse, usage };
    }

}
