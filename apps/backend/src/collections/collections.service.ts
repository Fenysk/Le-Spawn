import { Injectable, NotFoundException } from '@nestjs/common';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CollectionsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UUIDService
    ) { }

    async getMyCollections(userId: string) {
        const collections = await this.prismaService.collection.findMany({
            where: { User: { id: userId } },
            include: {
                VideoGames: {
                    include: {
                        Box: true,
                        Game: true,
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
                        Box: true,
                        Game: true,
                        extraContents: true,
                        Platform: true
                    }
                }
            }
        });

        if (!collection)
            throw new NotFoundException('Collection not found');

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
