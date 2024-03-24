import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto';
import { UUIDService } from 'src/common/uuid/uuid.service';

@Injectable()
export class ItemsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly UUIDService: UUIDService
    ) { }

    async getRecentItemsFeed(searchTerms: string, page: number = 1, limit: number = 10) {
        const items = await this.prismaService.item.findMany({
            where: {
                isVisible: true,
                Order: null,
                OR: [
                    { name: { contains: searchTerms } },
                    { description: { contains: searchTerms } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                User: {
                    select: {
                        Profile: true
                    }
                },
                Platform: true,
                extraContent: true
            }
        });

        if (!items.length)
            throw new NotFoundException('No items found');

        return items;
    }

    async getRandomItemsFeed(searchTerms: string, page: number = 1, limit: number = 10) {
        const numberOfItems = await this.prismaService.item.count({
            where: {
                isVisible: true,
                Order: null,
                OR: [
                    { name: { contains: searchTerms } },
                    { description: { contains: searchTerms } }
                ]
            }
        });

        if (!numberOfItems)
            throw new NotFoundException('No items found');

        const randomPage = Math.floor(Math.random() * (numberOfItems / limit));

        const items = await this.prismaService.item.findMany({
            where: {
                isVisible: true,
                Order: null,
                OR: [
                    { name: { contains: searchTerms } },
                    { description: { contains: searchTerms } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            skip: randomPage * limit,
            take: limit,
            include: {
                User: {
                    select: {
                        Profile: true
                    }
                },
                Platform: true,
                extraContent: true
            }
        });

        if (!items.length)
            throw new NotFoundException('No items found');

        return items;
    }

    async getMyAvailableItems(user_id: string, page: number = 1, limit: number = 10) {
        const items = await this.prismaService.item.findMany({
            where: {
                userId: user_id,
                Order: null
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                Platform: true,
                extraContent: true
            }
        });

        if (!items.length)
            throw new NotFoundException('No items found');

        return items;
    }

    async getItemById(item_id: string) {
        const item = await this.prismaService.item.update({
            where: { id: item_id },
            data: {
                clickCount: {
                    increment: 1
                }
            },
            include: {
                User: {
                    select: {
                        Profile: true
                    }
                },
                Platform: true,
                extraContent: true
            }
        });

        if (!item)
            throw new NotFoundException('Item not found');

        return item;
    }

    async publishItem(user_id: string, createItemDto: CreateItemDto) {

        const uniersalPrice = Number(createItemDto.price * 100);

        const itemId = this.UUIDService.getNewUUID('item');
        const generateId = () => this.UUIDService.getNewUUID('xcnt');

        const item = await this.prismaService.item.create({
            data: {
                User: { connect: { id: user_id } },
                Platform: { connect: { id: createItemDto.platformId } },
                extraContent: {
                    createMany: {
                        data: createItemDto.extraContent.map(content => ({ ...content, id: generateId() }))
                    }
                },

                id: itemId,
                name: createItemDto.name,
                edition: createItemDto.edition,
                region: createItemDto.region,
                description: createItemDto.description,
                hasBox: createItemDto.hasBox,
                stateBox: createItemDto.stateBox,
                hasGame: createItemDto.hasGame,
                stateGame: createItemDto.stateGame,
                price: uniersalPrice,
                images: createItemDto.images,
                isVisible: createItemDto.isVisible,
            }
        });

        return item;
    }

    async updateMyItem(user_id: string, item_id: string, data: any) {
        const updatedItem = await this.prismaService.item.update({
            where: { id: item_id, userId: user_id },
            data: {
                ...data
            }
        });

        return updatedItem;
    }

    async deleteMyItem(userId: string, itemId: string) {
        console.log('userId', userId);
        console.log('itemId', itemId);

        const item = await this.prismaService.item.findUnique({
            where: { id: itemId },
            include: { Order: true }
        });

        if (!item)
            throw new NotFoundException('Item not found');

        if (item.userId !== userId)
            throw new NotFoundException('Item not found');

        if (item.Order)
            throw new ConflictException('You cannot delete an item that has been ordered');

        await this.prismaService.item.delete({
            where: { id: itemId }
        });

        return 'Item deleted';
    }

}
