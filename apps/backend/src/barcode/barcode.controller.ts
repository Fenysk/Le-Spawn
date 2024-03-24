import { Controller, Get, Query } from '@nestjs/common';
import { BarcodeService } from './barcode.service';

@Controller('barcode')
export class BarcodeController {

    constructor(private readonly barcodeService: BarcodeService) { }

    @Get('from-url')
    getBarcodeDataFromUrl(
        @Query('url') url: string
    ) {
        return this.barcodeService.getBarcodeDataFromUrl(url);
    }

}
