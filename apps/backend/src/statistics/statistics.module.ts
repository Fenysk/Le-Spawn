import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';

@Module({
    imports: [CommonModule],
    providers: [StatisticsService],
    exports: [StatisticsService],
    controllers: [StatisticsController],
})
export class StatisticsModule { }
