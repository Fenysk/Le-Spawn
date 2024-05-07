import { Injectable } from '@nestjs/common';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatType } from 'src/statistics/enums/stat-type.enum';
import { StatisticsService } from 'src/statistics/statistics.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
    constructor(
        private readonly prismService: PrismaService,
        private readonly emailService: EmailService,
        private readonly uuidService: UUIDService,
        private readonly statisticsService: StatisticsService,
    ) { }

    async generateReport(userId: string, data: CreateReportDto) {
        const newReportId = this.uuidService.getNewUUID('rprt');

        const newReport = await this.prismService.report.create({
            data: {
                id: newReportId,
                subject: data.subject,
                message: data.message,
                photosUrl: data.photosUrls,
                User: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        await this.statisticsService.addNewStatistic({ type: StatType.ADD_NEW_REPORT, value: 1 }, userId);

        return newReport;
    }
}
