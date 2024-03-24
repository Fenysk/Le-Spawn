import { Injectable, NotFoundException } from '@nestjs/common';
import {
    BarcodeFormat,
    BinaryBitmap,
    DecodeHintType,
    HybridBinarizer,
    MultiFormatReader,
    RGBLuminanceSource,
} from '@zxing/library';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class BarcodeService {
    private reader = new MultiFormatReader();

    constructor() {
        const hints = new Map();
        const formats = [
            BarcodeFormat.EAN_13,
            BarcodeFormat.CODE_128,
            BarcodeFormat.CODE_39,
            BarcodeFormat.ITF,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.UPC_EAN_EXTENSION
        ];
        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
        this.reader.setHints(hints);
    }

    async getBarcodeDataFromUrl(imageUrl: string): Promise<string> {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            const { data, info } = await sharp(buffer)
                .raw()
                .ensureAlpha()
                .toBuffer({ resolveWithObject: true });

            const width = info.width;
            const height = info.height;
            const grayscaleBytes = new Uint8ClampedArray(width * height);
            for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                grayscaleBytes[j] =
                    0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            }

            const source = new RGBLuminanceSource(grayscaleBytes, width, height);
            const binaryBitmap = new BinaryBitmap(new HybridBinarizer(source));
            const result = this.reader.decode(binaryBitmap);
            return result.getText();
        } catch (error) {
            throw new NotFoundException('Barcode not found');
        }
    }
}
