import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorator';
import { GetUser, Roles } from 'src/users/decorator';
import { Role } from 'src/users/entities';
import { AddNewStatisticDto } from './dto/addNewStat.dto';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Roles(Role.ADMIN)
    @Get()
    async getAllStatistics() {
        return this.statisticsService.getAllStatistics();
    }

    @Public()
    @Post('anonyme')
    async addNewAnonymeStatistic(
        @Body() data: AddNewStatisticDto,
    ) {
        return this.statisticsService.addNewStatistic(data);
    }

    @Post('user')
    async addNewLoggedStatistic(
        @GetUser('sub') userId: string,
        @Body() data: AddNewStatisticDto,
    ) {
        return this.statisticsService.addNewStatistic(data, userId);
    }

    @Roles(Role.ADMIN)
    @Delete('all')
    async deleteAllStatistics() {
        return this.statisticsService.deleteAllStatistics();
    }

}
