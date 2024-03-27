import { ForbiddenException, Injectable } from '@nestjs/common';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddNewStatisticDto } from './dto/addNewStat.dto';
import { GetStatisticDto } from './dto/getStat.dto';
import { StatType } from './enums/stat-type.enum';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UUIDService,
    ) { }

    async getAllStatistics() {
        const stats = await this.prismaService.statistic.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        const count = await this.prismaService.statistic.count({
            orderBy: {
                createdAt: 'desc',
            },
        });

        const types = stats.map(stat => stat.type).filter((value, index, self) => self.indexOf(value) === index);

        return { count, types, stats };
    }

    async getSpecificStatistics(data: GetStatisticDto) {

        if (!Object.values(StatType).includes(data.type))
            throw new ForbiddenException('Invalid statistic type');

        data.userId = data.userId !== '' ? data.userId : undefined;

        const stats = await this.prismaService.statistic.findMany({
            where: {
                type: data.type,
                userId: data.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const count = await this.prismaService.statistic.count({
            where: {
                type: data.type,
                userId: data.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const types = stats.map(stat => stat.type).filter((value, index, self) => self.indexOf(value) === index);

        return { count, types, stats };
    }

    async addNewStatistic(data: AddNewStatisticDto, userId?: string) {
        const statId = this.uuidService.getNewUUID('stat');

        if (!Object.values(StatType).includes(data.type))
            throw new ForbiddenException('Invalid statistic type');

        const dataToCreate = {
            id: statId,
            type: data.type,
            value: data.value,
        };

        const connectUserData = userId ? { User: { connect: { id: userId } } } : {};

        const newStat = await this.prismaService.statistic.create({
            data: {
                ...dataToCreate,
                ...connectUserData,
            },
        });

        return newStat;
    }

    async deleteAllStatistics() {
        await this.prismaService.statistic.deleteMany();

        return 'All statistics have been deleted';
    }

}
