import { Module, forwardRef } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        CommonModule,
        forwardRef(() => UsersModule)
    ],
    controllers: [AddressesController],
    providers: [AddressesService],
    exports: [AddressesService],
})
export class AddressesModule { }
