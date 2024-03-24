import { Injectable } from '@nestjs/common';
import { OpenAiService } from './services/openai.service';
import { GameResponseDto } from './dto/game-response.dto';
import { AnthropicService } from './services/anthropic.service';

@Injectable()
export class AnalyzeService {

    constructor(
        private readonly openAiService: OpenAiService,
        private readonly anthropicService: AnthropicService
    ) { }

    async analyzeGamePhotosWithGPTVision(language: string, photos: string[]): Promise<GameResponseDto> {
        const prompt = `
        Analyze the photos. 

        Sends me the information in a JSON format like this type:
        '''json
        {
            name: string;
            platform: string;
            edition: string; // 'Standard' by default.
            region: string; // 'NTSC', 'PAL', ...
            hasBox: boolean;
            hasGame: boolean;
            stateBox: string | null; // 'PARTS', 'BAD', 'AVERAGE', 'GOOD', 'MINT'.
            stateGame: string | null;
            extraContent: { // all detailed content included (controllers, stickers, ...) in ${language}.
                name: string; // in ${language}.
                state: string;
            }[]; // Can be empty.
            description: string; // little item description <160 characters, in ${language}.
        }
        '''
        `;

        return this.openAiService.askToGPTVision(prompt, photos);
    }

    async analyzeGamePhotosWithAnthropicSonnet(language: string, photos: string[]): Promise<any> {
        const prompt = `
        Analyze the photos.

        Sends me the information in a JSON format like this type:
        '''json
        {
            name: string;
            platform: string;
            edition: string; // 'Standard' by default.
            region: string; // 'NTSC', 'PAL', ...
            hasBox: boolean;
            hasGame: boolean;
            stateBox: string | null; // 'PARTS', 'BAD', 'AVERAGE', 'GOOD', 'MINT'.
            stateGame: string | null;
            extraContent: { // all detailed content included (controllers, stickers, ...) in ${language}.
                name: string; // in ${language}.
                state: string;
            }[]; // Can be empty.
            description: string; // little item description <160 characters, in ${language}.
        }
        '''
        `;

        return this.anthropicService.askToSonnet(prompt, photos);
    }

}

const exemples = [
    {
        name: 'Wii Sports Resort',
        platform: 'Nintendo Wii',
        edition: 'Standard',
        region: 'NTSC',
        hasBox: true,
        hasGame: true,
        stateBox: 'GOOD',
        stateGame: 'GOOD',
        extraContent: [],
        description: 'Wii Sports Resort pour la Nintendo Wii avec boîte et disque en bon état. Vivez des sports virtuels sur une île paradisiaque.'
    },
    {
        name: 'The Legend of Zelda: Ocarina of Time',
        platform: 'Nintendo 64',
        edition: 'Standard',
        region: 'NTSC-J',
        hasBox: true,
        hasGame: true,
        stateBox: 'GOOD',
        stateGame: 'GOOD',
        extraContent: [
            { name: "Mode d'emploi", type: 'Manuel', state: 'GOOD' },
            { name: 'Brochure publicitaire', type: 'Flyer', state: 'AVERAGE' }
        ],
        description: "Édition japonaise de 'The Legend of Zelda: Ocarina of Time', avec boîte et manuel en bon état. Contient également un flyer."
    },
    {
        "type": "CONSOLE",
        "game": null,
        "console": {
            "name": "Wii U",
            "manufacturer": "Nintendo",
            "generation": 8,
            "region": "PAL",
            "hasBox": true,
            "hasConsole": true,
            "hasCables": true,
            "hasController": true,
            "stateBox": "GOOD",
            "stateConsole": "GOOD",
            "stateCables": "GOOD",
            "stateController": "GOOD",
            "extraContent": [
                {
                    "name": "Jeu Mario Kart 8 préinstallé",
                    "type": "Contenu numérique",
                    "state": "NA"
                },
                {
                    "name": "Injustice: Les Dieux sont Parmi Nous",
                    "type": "Jeu physique",
                    "state": "GOOD"
                }
            ],
            "description": "Pack Wii U Premium avec Mario Kart 8 pré-installé, codes et accessoires. Inclut une copie physique d'Injustice: Les Dieux sont Parmi Nous."
        },
        "manga": null
    }
];
