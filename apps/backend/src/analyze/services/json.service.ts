import { Injectable } from "@nestjs/common";
import { GameResponseDto } from "../dto/game-response.dto";

@Injectable()
export class JsonService {

    convertResponseToJSON(response: string): GameResponseDto {
        let message = response;

        if (message.includes('//'))
            message = message.replace(/\/\/.*/g, '');

        if (message.includes('{')) {
            const startChar = message.indexOf('{');
            const endChar = message.lastIndexOf('}');
            message = message.substring(startChar, endChar + 1);
        } else
            throw new Error('The response is not a JSON object');

        if (!message.startsWith('{'))
            throw new Error('The response is not a JSON object');

        try {
            const gameResponse: GameResponseDto = JSON.parse(message);
            return gameResponse;
        } catch (error) {
            throw new Error('Failed to parse JSON');
        }
    }
    
}
