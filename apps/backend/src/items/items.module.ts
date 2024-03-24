import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [CommonModule],
    controllers: [ItemsController],
    providers: [ItemsService],
    exports: [ItemsService]
})
export class ItemsModule { }
