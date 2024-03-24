import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Get()
    async getFile(@Body('fileName') fileName: string, @Res() res: any) {
        return await this.uploadService.getFile(fileName, res);
    }

    @Post('url')
    async getFileUrl(@Body('fileName') fileName: string) {
        const contentWithUrl = await this.uploadService.getFileUrl(fileName);
        return contentWithUrl;
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadAnyFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 10000000 })
            ]
        })
    ) file: Multer.File) {
        return await this.uploadService.uploadFile(file.originalname, file.buffer);
    }

    @Delete()
    async deleteFile(@Body('fileName') fileName: string) {
        return await this.uploadService.deleteFile(fileName);
    }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: 'image' })
            ]
        })
    ) file: Multer.File) {
        return await this.uploadService.uploadImageFile(file.originalname, file.buffer);
    }

    @Post('pdf')
    @UseInterceptors(FileInterceptor('file'))
    async uploadPdfFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1000000 }),
                new FileTypeValidator({ fileType: 'pdf' })
            ]
        })
    ) file: Multer.File) {
        return await this.uploadService.uploadFile(file.originalname, file.buffer);
    }

    @Post('from-url')
    async uploadFileFromUrl(
        @Body('fileName') fileName: string,
        @Body('url') url: string
    ) {
        return await this.uploadService.uploadFileFromUrl(fileName, url);
    }

}
