import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { VideoGamesController } from './video-games/video-games.controller';
import { VideoGamesService } from './video-games/video-games.service';

@Module({
    imports: [CommonModule],
    controllers: [CollectionsController, VideoGamesController],
    providers: [CollectionsService, VideoGamesService]
})
export class CollectionsModule { }
