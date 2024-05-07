import { Injectable } from '@nestjs/common';
import { StatType } from 'src/statistics/enums/stat-type.enum';
import { StatisticsService } from 'src/statistics/statistics.service';
import { UsersService } from 'src/users/users.service';
import { AnthropicService } from './services/anthropic.service';

@Injectable()
export class AnalyzeService {

    constructor(
        private readonly anthropicService: AnthropicService,
        private readonly statisticsService: StatisticsService,
        private readonly userService: UsersService
    ) { }

    async getUserRemainingAnalyses(userId: string) {
        // Get number of images analyzed by the user today
        // Get usage limit for the user with his roles
        // Compare both values
        // Return true if the user can analyze images, false otherwise

        const allUser_AI_USAGES = await this.statisticsService.getSpecificStatistics({ type: StatType.AI_USAGE, userId });

        const startOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999);

        const todayUser_AI_USAGES = allUser_AI_USAGES.stats.filter(stat => {
            const createdAt = new Date(stat.createdAt);
            return createdAt >= startOfToday && createdAt <= endOfToday;
        });

        const user = await this.userService.getUserById(userId);

        let limit = 0;

        if (user.roles.includes('USER'))
            limit = 5;
        
        if (user.roles.includes('PREMIUM'))
            limit = 50;

        if (user.roles.includes('ADMIN'))
            return 10000;

        const remainingUsages = limit - todayUser_AI_USAGES.length;

        return remainingUsages;
    }

    async analyzeGamePhotosWithAnthropic(language: string, photos: string[], model: string) {

        const prompt5 = `
These photos represent one or many parts of a video game.
Send me the information about this game in a single JSON object like this:
'''json
{
	title: string
	edition: string ("Platinum", "Limited", …. "Standard" by default)
	region: string ("PAL", "NTFS", "JAP" …)
	platformName: string
    description: string (in ${language})
	mainPhotoId: number
}
'''`;

        const prompt4 = `
Photos : min id = 1 ; max id = ${photos.length}. Mention all photo ids.

Send me the information in a JSON format like this type:
'''json
{
	title: string
	edition: string ("Platinum", "Limited", …. "Standard" by default)
	region: string ("PAL", "NTFS", "JAP" …)
	platformName: string
	mainPhotoId: number
}
'''`;

        const prompt3 = `
Instructions: Analyze the photos. Mention all photo ids. An item can have multiple photos. Min photoId : 1. Max photoId : ${photos.length}. An id can be used multiple times.

Send me the information in a JSON format like this type:
'''json
{
	photoBoxIds : number[] (photos of the box if exists)
	photoGameIds : number[] (photos of the game (only disk or cartridge) if exists)
	title : string
	edition : string ("Standard" by default)
	region : string ("PAL", "NTFS", …)
	platformName : string
	extraContents : { (all phyisical content (if exist) inside or outside the box except the game and the box)
	name : string (in ${language})
	type : string (documentation, figurine…)
	photoIds : number[] (photos of the content)
	}[]
	mainPhotoId : number
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

        const prompt = prompt5;

        return await this.anthropicService.askToClaude(prompt, photos, model);
    }

}
