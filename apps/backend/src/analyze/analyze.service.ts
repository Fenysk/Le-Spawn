import { Injectable } from '@nestjs/common';
import { GameResponseDto } from './dto/game-response.dto';
import { AnthropicService } from './services/anthropic.service';
import { OpenAiService } from './services/openai.service';

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

		return this.anthropicService.askToClaude(prompt, photos, 'claude-3-sonnet-20240229');
	}

	async analyzeGamePhotosWithAnthropicHaiku(language: string, photos: string[]): Promise<any> {

		const prompt3 = `
Instructions: Analyze the photos. Mention all photo ids. An item can have multiple photos. Min photoId : 1. Max photoId : ${photos.length}. An id can be used multiple times.

Send me the information in a JSON format like this type:
'''json
{
	photoBoxIds : number[] | null (photos of the box if exists)
	photoGameIds : number[] | null (photos of the game (only disk or cartridge) if exists)
	title : string
	edition : string ("Standard" by default)
	region : string ("PAL", "NTFS", …)
	platformName : string
	extraContents : { (all phyisical content (if exist) inside or outside the box except the game and the box)
	name : string (in ${language})
	type : string (documentation, figurine…)
	photoIds : number[] (photos of the content)
	}[]
	mainPhoto : number (the main photo id)
}
'''`;

		const prompt2 = `
Analyze the photos. Mention all photo ids.

Sends me the information in a JSON format like this type:
'''json
{
	photoBoxIds : number[] | null (photos of the box if exists)
	photoGameIds : number[] | null (photos of the game (only disk or cartridge) if exists)
	title : string
	edition : string ("Standard" by default)
	region : string ("PAL", "NTFS", …)
	platformName : string
	extraContents : { (each phyisical content inside and/or outside the box (if exist). Don't include the game and the box)
	name : string (in ${language})
	type : string (documentation, figurine…)
	photoIds : number[] (photos of the content)
	}[]
	mainPhoto : number (the main photo id)
}
'''`;

		const prompt1 = `
Analyze the photos. Mention all photo ids.

Sends me the information in a JSON format like this type:
'''json
{
	photoBoxIds : number[] | null (if the box exists)
	photoGameIds : number[] | null (if the game (Disk or Cartridge) exists)
	title : string (of the game)
	edition : string ("Standard" by default)
	region : string ("PAL", "NTFS", …)
	platformName : string
	extraContents : { (each phyisical content inside and/or outside the box (if exist). Don't include the game and the box)
	name : string (in ${language})
	type : string (documentation, figurine…)
	photoIds : number[] (photos of the content)
	}[]
	mainPhoto : number (the main photo id)
}
'''`;

		const prompt = prompt3;

		return this.anthropicService.askToClaude(prompt, photos, 'claude-3-haiku-20240307');
	}

}
