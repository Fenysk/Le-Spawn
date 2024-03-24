import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { GetUser } from 'src/users/decorator';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Get('mine')
    async getMyAddresses(@GetUser('sub') userId: string) {
        return await this.addressesService.getMyAddresses(userId);
    }

    @Post('new')
    async createAddress(@GetUser('sub') userId: string, @Body() newAddress: CreateAddressDto) {
        return await this.addressesService.createAddress(userId, newAddress);
    }

    @Post('default/customer/:id')
    async setDefaultCustomerAddress(
        @GetUser('sub') userId: string,
        @Param('id') id: string
    ) {
        return await this.addressesService.setDefaultCustomerAddress(userId, id);
    }

    @Post('default/seller/:id')
    async setDefaultSellerAddress(
        @GetUser('sub') userId: string,
        @Param('id') id: string
    ) {
        return await this.addressesService.setDefaultSellerAddress(userId, id);
    }

    @Delete('delete/:id')
    async deleteAddress(@GetUser('sub') userId: string, @Param('id') id: string) {
        return await this.addressesService.deleteAddress(userId, id);
    }

}
