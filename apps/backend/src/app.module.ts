import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddressesModule } from './addresses/addresses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { ShippingModule } from './shipping/shipping.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { CommonModule } from './common/common.module';
import { PlatformsModule } from './platforms/platforms.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { CollectionsModule } from './collections/collections.module';
import { BarcodeModule } from './barcode/barcode.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ReportsModule } from './reports/reports.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AuthModule,
        UsersModule,
        PrismaModule,
        EmailModule,
        ItemsModule,
        OrdersModule,
        AddressesModule,
        PaymentModule,
        ShippingModule,
        UploadModule,
        SettingsModule,
        CommonModule,
        PlatformsModule,
        AnalyzeModule,
        CollectionsModule,
        BarcodeModule,
        StatisticsModule,
        ReportsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
