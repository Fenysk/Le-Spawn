import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [forwardRef(() => UploadModule)],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ([{
                ttl: configService.getOrThrow('THROTTLE_TTL'),
                limit: configService.getOrThrow('THROTTLE_LIMIT'),
            }]),
        }),
        StatisticsModule
    ],
    providers: [
        UploadService,
        {
            provide: 'APP_GUARD',
            useClass: ThrottlerGuard,
        }
    ],
    controllers: [UploadController],
    exports: [UploadService]
})
export class UploadModule { }
