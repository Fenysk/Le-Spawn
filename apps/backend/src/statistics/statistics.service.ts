import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddNewStatisticDto } from './dto/addNewStat.dto';
import { StatType } from './enums/stat-type.enum';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly uuidService: UUIDService,
    ) { }

    async getAllStatistics() {
        const stats = await this.prismaService.statistic.findMany();

        if (!stats.length)
            throw new NotFoundException('No statistics found');

        return stats;
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
