import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime-types';
import * as sharp from 'sharp';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
    private readonly s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') })
    constructor(private readonly configService: ConfigService) { }

    async getFile(fileName: string, res?: any) {
        const command = new GetObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
            Key: fileName,
        });
        const response = await this.s3Client.send(command);
        const readableStream = Readable.from(response.Body as any);

        if (!res)
            return readableStream;

        res.setHeader('Content-Type', mime.lookup(fileName) || 'application/octet-stream');
        readableStream.pipe(res);
    }

    async getFileUrl(fileName: string) {
        const command = new GetObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
            Key: fileName,
        });

        const url = await getSignedUrl(this.s3Client, command);

        return { url };
    }

    async uploadFile(fileName: string, fileContent: Buffer) {

        const clearFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '');

        const contentType = mime.lookup(clearFileName) || 'application/octet-stream';

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
                Key: clearFileName,
                Body: fileContent,
                ContentType: contentType,
            })
        );

        const awsBucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
        const awsRegion = this.configService.getOrThrow('AWS_S3_REGION');
        const url = `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/${clearFileName}`;

        return { url };
    }

    async uploadImageFile(fileName: string, fileContent: Buffer) {

        const clearFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '').replace(/\.[^/.]+$/, ".webp");

        const convertedFileContent = await sharp(fileContent)
            .webp({ quality: 100 })
            .resize(1080, 1080, { fit: 'outside', withoutEnlargement: true })
            .toBuffer();

        const contentType = 'image/webp';

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
                Key: clearFileName,
                Body: convertedFileContent,
                ContentType: contentType,
            })
        );

        const awsBucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
        const awsRegion = this.configService.getOrThrow('AWS_S3_REGION');
        const url = `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/${clearFileName}`;

        return { url };
    }

    async deleteFile(fileName: string) {
        const response = await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
                Key: fileName,
            })
        );

        return response;
    }

    async uploadFileFromUrl(fileName: string, fileUrl: string) {
        try {
            const fileResponse = await fetch(fileUrl);

            if (!fileResponse.ok) {
                throw new NotFoundException('Failed to fetch the file');
            }

            const fileContent = await fileResponse.arrayBuffer();
            const fileType = fileResponse.headers.get('content-type') || 'unknown';
            const fileExtension = fileType.split('/')[1];
            const fileNameWithExtension = `${fileName}.${fileExtension}`;

            const response = await this.uploadFile(fileNameWithExtension, Buffer.from(fileContent));

            return response;
        } catch (error) {
            throw new Error('Failed to upload the file');
        }
    }


}
