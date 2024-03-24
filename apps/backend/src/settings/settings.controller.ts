import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Roles } from 'src/users/decorator';
import { Role } from 'src/users/entities';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Roles(Role.ADMIN)
    @Get()
    async getAllSettings() {
        return this.settingsService.getAllSettings();
    }

    @Roles(Role.ADMIN)
    @Get('/:key')
    async getSettings(@Param('key') key: string) {
        return this.settingsService.getSettings(key);
    }

    @Roles(Role.ADMIN)
    @Put()
    async updateSettings(@Body() data: any): Promise<string> {
        return this.settingsService.updateSettings(data);
    }

    @Roles(Role.ADMIN)
    @Delete('/:key')
    async deleteSettings(@Param('key') key: string) {
        return this.settingsService.deleteSettings(key);
    }

}
