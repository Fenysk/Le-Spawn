import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/users/decorator';
import { AddVideoGameDto } from '../dto/add-video-game.dto';
import { VideoGamesService } from './video-games.service';

@Controller('video-games')
export class VideoGamesController {

    constructor(private readonly videoGamesService: VideoGamesService) { }

    @Get(':id')
    getVideoGameById(
        @Param('id') videoGameId: string
    ) {
        return this.videoGamesService.getVideoGameById(videoGameId);
    }

    @Post()
    addNewVideoGameToCollection(
        @GetUser('sub') userId: string,
        @Body() data: AddVideoGameDto
    ) {
        return this.videoGamesService.addNewVideoGameToCollection(userId, data);
    }

    @Delete(':id')
    deleteVideoGameFromCollection(
        @GetUser('sub') userId: string,
        @Param('id') videoGameId: string
    ) {
        return this.videoGamesService.deleteVideoGameFromCollection(userId, videoGameId);
    }

}
