import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/users/decorator';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) { }

    @Get('relay-point/check/:relayId')
    @HttpCode(HttpStatus.OK)
    async checkIfRelayPointExists(
        @Param('relayId') relayId: string
    ) {
        return this.shippingService.checkIfRelayPointExists(relayId);
    }

    @Get('relay-points/default')
    @HttpCode(HttpStatus.OK)
    async getRelayPointsArroundMeByDefaultAddress(
        @GetUser('sub') userId: string
    ) {
        return this.shippingService.getRelayPointsArroundMeByDefaultCustomerAddress(userId);
    }

    @Get('relay-points/:addressId')
    @HttpCode(HttpStatus.OK)
    async getRelayPointsArroundMeByAddressId(
        @GetUser('sub') userId: string,
        @Param('addressId') addressId: string
    ) {
        return this.shippingService.getRelayPointsArroundMeByAddressId(userId, addressId);
    }

    @Post('create-expedition/:orderId')
    @HttpCode(HttpStatus.OK)
    async createExpedition(
        @Param('orderId') orderId: string
    ) {
        return this.shippingService.createRelayExpedition(orderId);
    }

    @Get('get-etiquette/:expeditionNumber')
    @HttpCode(HttpStatus.OK)
    async getRelayExpeditionEtiquette(
        @Param('expeditionNumber') expeditionNumber: string
    ) {
        return this.shippingService.getRelayExpeditionEtiquette(expeditionNumber);
    }

    @Get('check-expedition/:expeditionNumber')
    @HttpCode(HttpStatus.OK)
    async checkRelayExpedition(
        @Param('expeditionNumber') expeditionNumber: string
    ) {
        return this.shippingService.checkRelayExpedition(expeditionNumber);
    }

}
