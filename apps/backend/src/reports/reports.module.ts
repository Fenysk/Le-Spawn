import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { EmailModule } from 'src/email/email.module';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
    imports: [EmailModule, CommonModule, StatisticsModule],
    controllers: [ReportsController],
    providers: [ReportsService]
})
export class ReportsModule { }
