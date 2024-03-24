import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private readonly prismService: PrismaService) { }

    async getAllSettings() {
        const settings = await this.prismService.setting.findMany();

        if (!settings.length)
            throw new NotFoundException('No settings found');

        return settings;

    }

    async getSettings(key: string) {
        const setting = await this.prismService.setting.findUnique({
            where: { key: key }
        });

        if (!setting)
            throw new NotFoundException(`Setting with key ${key} not found`);

        return setting;
    }

    async updateSettings(data: any): Promise<string> {
        const settings = await this.prismService.setting.upsert({
            where: { key: data.key },
            update: data,
            create: data,
        });

        return `${settings.key} updated to ${settings.value} successfully !`;
    }

    async deleteSettings(key: string) {
        const setting = await this.prismService.setting.delete({
            where: { key: key }
        });

        return `${setting.key} deleted successfully !`;
    }

}
