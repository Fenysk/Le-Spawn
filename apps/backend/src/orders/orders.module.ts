import { Module, forwardRef } from '@nestjs/common';
import { PaymentModule } from 'src/payment/payment.module';
import { ShippingModule } from 'src/shipping/shipping.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        CommonModule,
        UsersModule,

        forwardRef(() => PaymentModule),
        forwardRef(() => ShippingModule)
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService]
})
export class OrdersModule { }
