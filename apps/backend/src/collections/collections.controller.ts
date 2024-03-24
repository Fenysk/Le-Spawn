import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/users/decorator';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('collections')
export class CollectionsController {

    constructor(private readonly collectionsService: CollectionsService) { }

    @Get('mine')
    getMyCollections(
        @GetUser('sub') userId: string
    ) {
        return this.collectionsService.getMyCollections(userId);
    }

    @Get(':id')
    getCollectionById(
        @GetUser('sub') userId: string,
        @Param('id') collectionId: string
    ) {
        return this.collectionsService.getCollectionById(userId, collectionId);
    }

    @Post()
    createNewCollection(
        @GetUser('sub') userId: string,
        @Body() data: CreateCollectionDto,
    ) {
        return this.collectionsService.createNewCollection(userId, data.name, data.description);
    }

    @Delete(':id')
    deleteCollection(
        @GetUser('sub') userId: string,
        @Param('id') collectionId: string
    ) {
        return this.collectionsService.deleteCollection(userId, collectionId);
    }

}
