import { BadRequestException, Body, Controller, FileTypeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { StatType } from 'src/statistics/enums/stat-type.enum';
import { StatisticsService } from 'src/statistics/statistics.service';
import { GetUser } from 'src/users/decorator';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly statisticsService: StatisticsService
    ) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageFile(
        @UploadedFile(new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image' })] })) file: Multer.File,
        @GetUser('sub') userId: string
    ) {
        if (!file)
            throw new BadRequestException('No file provided');

        const url = await this.uploadService.uploadImageFile(file.originalname, file.buffer);

        await this.statisticsService.addNewStatistic({ type: StatType.UPLOAD_IMAGES, value: 1 }, userId);

        return { url };
    }

    @Post('images')
    @UseInterceptors(FilesInterceptor('files', 10)) // max 10
    async uploadMultipleImageFiles(
        @UploadedFiles(new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image' })] })) files: Array<Multer.File>,
        @GetUser('sub') userId: string
    ) {

        if (!files.length)
            throw new BadRequestException('No files provided');

        const urls = await this.uploadService.uploadMultipleImageFiles(files);

        await this.statisticsService.addNewStatistic({ type: StatType.UPLOAD_IMAGES, value: files.length }, userId);

        return { urls };
    }

    @Post('from-url')
    async uploadFileFromUrl(
        @Body('fileName') fileName: string,
        @Body('url') url: string
    ) {
        return await this.uploadService.uploadFileFromUrl(fileName, url);
    }

}
