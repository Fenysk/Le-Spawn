import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AddressesModule } from 'src/addresses/addresses.module';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        CommonModule,
        forwardRef(() => AddressesModule),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule { }
