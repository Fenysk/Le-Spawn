import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { Roles } from 'src/users/decorator';
import { Role } from 'src/users/entities';
import { CreatePlatformDto } from './dto';

@Controller('platforms')
export class PlatformsController {
    constructor(private readonly platformsService: PlatformsService) { }

    @Get()
    async getAllPlatforms() {
        return this.platformsService.getAllPlatforms();
    }

    @Roles(Role.ADMIN)
    @Post()
    async addNewPlatform(
        @Body() newPlatform: CreatePlatformDto
    ) {
        return this.platformsService.addNewPlatform(newPlatform);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    async deletePlatform(
        @Param('id') id: string
    ) {
        return this.platformsService.deletePlatform(id);
    }

}
