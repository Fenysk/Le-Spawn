import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from "argon2";
import { EmailService } from 'src/email/email.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) { }

    async register(registerDto: RegisterDto): Promise<any> {
        const user = await this.userService.getUserByEmail(registerDto.email);

        if (user)
            throw new ForbiddenException('You are already registered');

        const hashedPassword = await argon2.hash(registerDto.password);

        console.log(registerDto);

        const newUser: any = await this.userService.createUser({
            email: registerDto.email,
            hashedPassword,
            nickName: registerDto.nickName,
        });

        console.log(newUser);

        const confirmationId: string = await this.emailService.sendEmailConfirmation(newUser);

        const updatedUser = await this.userService.updateUser(newUser.id, {
            confirmationId
        })

        return 'Your account has been created successfully, please check your email to confirm your account';
    }

    async login(loginDto: LoginDto): Promise<Tokens> {
        const user = await this.userService.getUserByEmail(loginDto.email);

        if (!user || !user?.confirmed)
            throw new ForbiddenException('Access denied');

        const isPasswordValid = await argon2.verify(user?.hashedPassword, loginDto.password);

        if (!isPasswordValid)
            throw new ForbiddenException('Access denied');

        delete user.hashedPassword;

        const tokens = await this.getTokens(user);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

        return tokens;
    }

    async disconnect(userId: string): Promise<void> {
        await this.userService.updateUser(userId, {
            refreshToken: null
        });
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
        const user: any = await this.userService.getUserById(userId);

        if (!user?.refreshToken)
            throw new ForbiddenException('Access denied');

        const isRefreshTokenValid = await argon2.verify(user.refreshToken, refreshToken);

        if (!isRefreshTokenValid)
            throw new ForbiddenException('Access denied');

        const tokens = await this.getTokens(user);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

        return tokens;
    }

    async confirmEmail(id: string): Promise<string> {
        const user = await this.userService.getUserByConfirmationId(id);

        if (!user)
            throw new ForbiddenException('Access denied');

        await this.userService.updateUser(user.id, {
            confirmed: true,
            confirmationId: null,
            roles: { push: 'USER' }
        });

        await this.emailService.sendEmailWelcome(user);

        return 'Email confirmed successfully !';
    }





    async getTokens(user: any): Promise<Tokens> {
        const payload = {
            sub: user.id,
            email: user.email
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15h',
            secret: this.configService.get('JWT_ACCESS_SECRET')
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });

        const tokens = { accessToken, refreshToken };

        return tokens;
    }

    async updateRefreshTokenHash(id: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await argon2.hash(refreshToken);

        await this.userService.updateUser(id, {
            refreshToken: hashedRefreshToken
        });
    }

}
