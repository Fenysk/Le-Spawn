import { Injectable, NotFoundException } from '@nestjs/common';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatType } from 'src/statistics/enums/stat-type.enum';
import { StatisticsService } from 'src/statistics/statistics.service';
import { AddVideoGameDto } from '../dto/add-video-game.dto';

@Injectable()
export class VideoGamesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UUIDService,
        private readonly statisticsService: StatisticsService
    ) { }

    async getVideoGameById(videoGameId: string) {
        const videoGame = await this.prismaService.videoGame.findUnique({
            where: {
                id: videoGameId,
            },
            include: {
                Platform: true,
                extraContents: true
            }
        });

        if (!videoGame)
            throw new NotFoundException('Video game not found');

        return videoGame;
    }

    async addNewVideoGameToCollection(userId: string, data: AddVideoGameDto) {
        const videoGameId = this.uuidService.getNewUUID('game');

        const videoGameData = {
            id: videoGameId,
            title: data.title,
            description: data.description,
            edition: data.edition,
            region: data.region,
            tags: data.tags,
            ageRating: data.ageRating,
            editor: data.editor,
            developer: data.developer,
            releaseDate: data.releaseDate,
            maxMultiplayerLocalPlayers: data.maxMultiplayerLocalPlayers,
            maxMultiplayerOnlinePlayers: data.maxMultiplayerOnlinePlayers,
            Collection: {
                connect: {
                    id: data.collectionId
                }
            },
            Platform: {
                connect: {
                    id: data.platformId
                }
            },
            mainPhoto: data.mainPhoto,
            stateBox: data.stateBox,
            photosBox: data.photosBox,
            stateGame: data.stateGame,
            photosGame: data.photosGame,
            extraContents: undefined,
            initialPurchasePrice: data.initialPurchasePrice,
            negotiatedPurchasePrice: data.negotiatedPurchasePrice,
            estimatedPrice: data.estimatedPrice,
            currency: data.currency,
        };

        const extraContentsData: any = {};
        if (data.extraContents?.length > 0) {
            extraContentsData.create = data.extraContents.map((extraContent) => {
                return {
                    id: this.uuidService.getNewUUID('xcnt'),
                    name: extraContent.name,
                    type: extraContent.type,
                    state: extraContent.state,
                };
            });

            videoGameData.extraContents = extraContentsData;
        }

        const newVideoGame = await this.prismaService.videoGame.create({
            data: videoGameData,
            include: {
                Platform: true,
                extraContents: true
            }
        });

        await this.statisticsService.addNewStatistic({ type: StatType.ADD_NEW_ITEM_VIDEO_GAME}, userId);

        return newVideoGame;
    }

    async deleteVideoGameFromCollection(userId: string, videoGameId: string) {
        const videoGame = await this.prismaService.videoGame.findUnique({
            where: {
                id: videoGameId,
            },
            include: {
                Collection: {
                    select: {
                        id: true,
                        userId: true
                    }
                }
            }
        });

        if (!videoGame || videoGame.Collection.userId !== userId)
            throw new NotFoundException('Video game not found');

        await this.prismaService.videoGame.delete({
            where: {
                id: videoGameId
            }
        });

        await this.statisticsService.addNewStatistic({ type: StatType.REMOVE_ITEM_VIDEO_GAME }, userId);

        return `${videoGame.title} has been deleted from your collection.`;
    }

}
