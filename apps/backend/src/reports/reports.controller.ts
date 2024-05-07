import { Body, Controller, Post } from '@nestjs/common';
import { GetUser } from 'src/users/decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
    ) {}

    @Post('generate')
    async generateNewReport(
        @GetUser('sub') userId: string,
        @Body() data: CreateReportDto,
    ) {
        console.log('userId', userId);
        console.log('data', data);
        return this.reportsService.generateReport(userId, data);
    }
}
