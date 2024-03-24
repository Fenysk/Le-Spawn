import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAccessTokenGuard } from './auth/guards';
import { PrismaClientExceptionFilter } from './prisma/filters/prisma/prisma-exception.filter';
import { RolesGuard } from './users/guards';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Prisma
    app.useGlobalFilters(new PrismaClientExceptionFilter())

    // JWT et Roles
    app.useGlobalGuards(
        new JwtAccessTokenGuard(new Reflector()),
        new RolesGuard(new Reflector())
    )

    // DTO Validation
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }))

    // Cors
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        allowedHeaders: 'Content-Type, Authorization',
    });

    // Run
    const PORT = process.env.NEST_PORT || 3621;
    await app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} 🚀`);
    });
}
bootstrap();
