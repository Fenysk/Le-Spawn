import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { GetUser } from 'src/users/decorator';
import { CreateOrderDto } from './dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('mine')
    async getMyOrders(@GetUser('sub') userId: string) {
        return await this.ordersService.getMyOrders(userId);
    }

    @Get('sales')
    async getMySales(@GetUser('sub') userId: string) {
        return await this.ordersService.getMySales(userId);
    }

    @Post('create')
    async createOrder(
        @GetUser('sub') userId: string,
        @Body() data: CreateOrderDto
    ) {
        return await this.ordersService.createOrder(userId, data);
    }

    @Put('updated/:orderId')
    @HttpCode(HttpStatus.OK)
    async getMyUpdatedOrder(
        @GetUser('sub') userId: string,
        @Param('orderId') orderId: string
    ) {
        return await this.ordersService.getMyUpdatedOrder(userId, orderId);
    }

}
