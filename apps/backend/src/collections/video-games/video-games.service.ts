import { Injectable, NotFoundException } from '@nestjs/common';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddVideoGameDto } from '../dto/add-video-game.dto';

@Injectable()
export class VideoGamesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UUIDService
    ) { }

    async getVideoGameById(videoGameId: string) {
        const videoGame = await this.prismaService.videoGame.findUnique({
            where: {
                id: videoGameId,
            },
            include: {
                Box: true,
                Game: true,
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
            Box: undefined,
            Game: undefined,
            extraContents: undefined,
            initialPurchasePrice: data.initialPurchasePrice,
            negotiatedPurchasePrice: data.negotiatedPurchasePrice,
            estimatedPrice: data.estimatedPrice,
            currency: data.currency,
        };

        const boxData: any = {};
        if (data.stateBox) boxData.stateBox = data.stateBox;
        if (data.photoFrontBox) boxData.photoFrontBox = data.photoFrontBox;
        if (data.photoBackBox) boxData.photoBackBox = data.photoBackBox;
        if (data.photoSideBox) boxData.photoSideBox = data.photoSideBox;
        if (data.photoInsideBox) boxData.photoInsideBox = data.photoInsideBox;

        if (Object.keys(boxData).length > 0) {
            videoGameData.Box = {
                create: boxData
            };
        }

        const gameData: any = {};
        if (data.stateGame) gameData.stateGame = data.stateGame;
        if (data.photoFrontGame) gameData.photoFrontGame = data.photoFrontGame;
        if (data.photoBackGame) gameData.photoBackGame = data.photoBackGame;

        if (Object.keys(gameData).length > 0) {
            videoGameData.Game = {
                create: gameData
            };
        }

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
                Box: true,
                Game: true,
                Platform: true,
                extraContents: true
            }
        });

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

        return `${videoGame.title} has been deleted from your collection.`;
    }

}
