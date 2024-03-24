import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/users/decorator';
import { AuthService } from './auth.service';
import { Public } from './decorator';
import { LoginDto, RegisterDto } from './dto';
import { JwtRefreshTokenGuard } from './guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() registerDto: RegisterDto): Promise<any> {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto): Promise<Tokens> {
        return this.authService.login(loginDto);
    }

    @Post('disconnect')
    @HttpCode(HttpStatus.OK)
    disconnect(@GetUser('sub') userId: string) {
        return this.authService.disconnect(userId);
    }

    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetUser('sub') userId: string,
        @GetUser('refreshToken') refreshToken: string
    ) {
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Public()
    @Post('confirm-account/:id')
    confirmEmail(@Param('id') id: string) {
        return this.authService.confirmEmail(id);
    }

}
