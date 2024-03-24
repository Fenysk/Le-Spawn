import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorator';
import { GetUser, Roles } from 'src/users/decorator';
import { Role } from 'src/users/entities';
import { CreateItemDto } from './dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Public()
    @Get('recent')
    getRecentItemsFeed(
        @Query('terms') searchTerms: string = '',
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.itemsService.getRecentItemsFeed(searchTerms, +page, +limit);
    }

    @Public()
    @Get('random')
    getRandomItemsFeed(
        @Query('terms') searchTerms: string = '',
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.itemsService.getRandomItemsFeed(searchTerms, +page, +limit);
    }

    @Roles(Role.USER)
    @Get('mine')
    getMyAvailableItems(
        @GetUser('sub') user_id: any,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.itemsService.getMyAvailableItems(user_id, +page, +limit);
    }

    @Public()
    @Get(':itemId')
    getItemById(@Param('itemId') itemId: string) {
        return this.itemsService.getItemById(itemId);
    }

    @Roles(Role.SELLER)
    @Post('publish')
    publishItem(@GetUser('sub') user_id: any, @Body() createItemDto: CreateItemDto) {
        return this.itemsService.publishItem(user_id, createItemDto);
    }

    @Roles(Role.SELLER)
    @Put('update/mine/:id')
    updateMyItem(@GetUser('sub') user_id: any, @Param('id') item_id: string, @Body() data: any) {
        return this.itemsService.updateMyItem(user_id, item_id, data);
    }

    @Roles(Role.SELLER)
    @Delete(':id')
    deleteMyItem(
        @GetUser('sub') user_id: any,
        @Param('id') item_id: string
    ) {
        return this.itemsService.deleteMyItem(user_id, item_id);
    }

}
