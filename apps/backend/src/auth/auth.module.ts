import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy } from './strategy';

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
        EmailModule,
        StatisticsModule
    ],
    providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }
