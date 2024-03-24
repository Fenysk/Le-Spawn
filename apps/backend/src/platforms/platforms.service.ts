import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlatformDto } from './dto';
import { UUIDService } from 'src/common/uuid/uuid.service';

@Injectable()
export class PlatformsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly UUIDService: UUIDService,
    ) { }

    async getAllPlatforms() {
        return this.prismaService.platform.findMany({
            include: {
                Items: true
            }
        });
    }

    async addNewPlatform(newPlatform: CreatePlatformDto) {
        const platformId = this.UUIDService.getNewUUID('pltf');

        return this.prismaService.platform.create({
            data: {
                id: platformId,
                ...newPlatform,
            }
        });
    }

    async deletePlatform(id: string) {
        const platform = await this.prismaService.platform.findUnique({
            where: { id },
            select: { name: true }
        });

        if (!platform)
            throw new NotFoundException('Platform not found');

        await this.prismaService.platform.delete({
            where: { id }
        });

        return `Platform ${platform.name} deleted`;
    }

}
