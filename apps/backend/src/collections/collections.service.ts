import { Injectable, NotFoundException } from '@nestjs/common';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatType } from 'src/statistics/enums/stat-type.enum';
import { StatisticsService } from 'src/statistics/statistics.service';

@Injectable()
export class CollectionsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UUIDService,
        private readonly statisticsService: StatisticsService
    ) { }

    async getMyCollections(userId: string) {
        const collections = await this.prismaService.collection.findMany({
            where: { User: { id: userId } },
            include: {
                VideoGames: {
                    include: {
                        extraContents: true,
                        Platform: true
                    }
                }
            }
        });

        if (!collections.length)
            throw new NotFoundException('No collections found');

        return collections;
    }

    async getCollectionById(userId: string, collectionId: string) {
        const collection = await this.prismaService.collection.findFirst({
            where: {
                id: collectionId,
                User: { id: userId }
            },
            include: {
                VideoGames: {
                    include: {
                        extraContents: true,
                        Platform: true
                    }
                }
            }
        });

        if (!collection)
            throw new NotFoundException('Collection not found');

        await this.statisticsService.addNewStatistic({ type: StatType.USER_COLLECTION_VISIT }, userId);

        return collection;
    }

    async createNewCollection(userId: string, name: string, description?: string) {
        const collectionId = this.uuidService.getNewUUID('clcn');

        const collection = await this.prismaService.collection.create({
            data: {
                id: collectionId,
                name,
                description,
                User: { connect: { id: userId } }
            }
        });

        if (!collection)
            throw new NotFoundException('Failed to create collection');

        return collection;
    }

    async deleteCollection(userId: string, collectionId: string) {
        const collection = await this.prismaService.collection.findFirst({
            where: {
                id: collectionId,
                User: { id: userId }
            }
        });

        if (!collection)
            throw new NotFoundException('Collection not found');

        await this.prismaService.collection.delete({
            where: { id: collectionId }
        });

        return `${collection.name} deleted successfully`;
    }

}
