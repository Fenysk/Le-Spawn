import { Injectable } from '@nestjs/common';
import { AnthropicService } from './services/anthropic.service';

@Injectable()
export class AnalyzeService {

    constructor(
        private readonly anthropicService: AnthropicService
    ) { }

    async analyzeGamePhotosWithAnthropic(language: string, photos: string[], model: string): Promise<any> {

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

        return this.anthropicService.askToClaude(prompt, photos, model);
    }

}
