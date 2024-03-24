import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Address, OrderStatus, PaymentStatus, PersonalInformation, Profile, ShippingStatus, User } from '@prisma/client';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShippingService } from 'src/shipping/shipping.service';
import { UsersService } from 'src/users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly UUIDService: UUIDService,
        private readonly configService: ConfigService,

        @Inject(forwardRef(() => PaymentService)) private readonly paymentService: PaymentService,
        @Inject(forwardRef(() => ShippingService)) private readonly shippingService: ShippingService,
    ) { }

    async getMyOrders(userId: string) {
        const orders = await this.prismaService.order.findMany({
            where: { userId },
            include: {
                Address: true,
                Item: true,
                Payment: true,
                Shipping: true
            }
        });

        if (!orders.length)
            throw new NotFoundException('No orders found for this user');

        return orders;
    }

    async getMySales(userId: string) {
        const items = await this.prismaService.item.findMany({
            where: {
                User: { id: userId },
                Order: { isNot: null }
            },
            include: {
                Order: {
                    include: {
                        User: true,
                        Address: true,
                        Payment: true,
                        Shipping: true
                    }
                }
            }
        });

        if (!items.length)
            throw new NotFoundException('No sales found for this user');

        return items;
    };

    async getOrderByIdWithDetails(orderId: string) {
        const order = await this.prismaService.order.findUniqueOrThrow({
            where: { id: orderId },
            include: {
                Item: {
                    include: {
                        User: true
                    }
                },
                Payment: true,
                Shipping: true
            }
        });

        return order;
    }

    async getUserOrderByIdWithDetails(userId: string, orderId: string) {
        const order = await this.prismaService.order.findUnique({
            where: {
                id: orderId,
                User: { id: userId },
            },
            include: {
                Item: true,
                Payment: true,
                Shipping: true
            }
        });

        if (!order)
            throw new NotFoundException('Order not found');

        return order;
    }

    async createOrder(userId: string, orderToCreate: CreateOrderDto) {
        const user: User & { Addresses: Address, Profile: Profile, PersonalInformation: PersonalInformation } = await this.usersService.getUserById(userId);

        const userHasPersonnalInfos = user.PersonalInformation.firstName && user.PersonalInformation.lastName && user.Profile.nickName && user.Addresses;

        if (!userHasPersonnalInfos)
            throw new NotFoundException('User has no personnal infos');

        const { itemId, addressId, carrierName, relayId } = orderToCreate;

        const item = await this.prismaService.item.findUniqueOrThrow({
            where: {
                id: itemId,
                Order: null
            },
        });

        const address = await this.prismaService.address.findUniqueOrThrow({
            where: { id: addressId, userId },
        });

        if (!await this.shippingService.checkIfRelayPointExists(relayId))
            throw new NotFoundException('Relay point not found');

        const itemAmount = Number(item.price);
        const tax = Number(this.configService.get('TAX_AMOUNT')) || 0;
        const shippingAmount = Number(this.configService.get('MONDIAL_RELAY_SHIPPING_AMOUNT')) || 500;
        const taxAmount = Number(itemAmount * tax);
        const totalAmount = Number(itemAmount + taxAmount + shippingAmount);

        const orderId = this.UUIDService.getNewUUID('ordr');
        const paymentId = this.UUIDService.getNewUUID('pymt');
        const shippingId = this.UUIDService.getNewUUID('shpg');

        const newOrder = await this.prismaService.order.create({
            data: {
                id: orderId,
                itemAmount,
                taxAmount,
                shippingAmount,
                totalAmount,
                Address: { connect: { id: addressId } },
                User: { connect: { id: userId } },
                Item: { connect: { id: itemId } },
                Payment: {
                    create: {
                        id: paymentId,
                        amountTotal: totalAmount
                    }
                },
                Shipping: {
                    create: {
                        id: shippingId,
                        relayId,
                        carrierName,
                    }
                }
            },
            include: {
                Item: {
                    include: {
                        User: true
                    }
                },
                Payment: true,
                Shipping: true
            }
        });

        return newOrder;
    }

    getCartTotalAmount(cart: any): number {
        let totalAmount = 0;
        for (const cartItem of cart.CartItem) {
            totalAmount += Number((cartItem.Item.price).toString())
        }
        return totalAmount;
    }

    setShippingInfosToOrder(orderId: any, shippingInfos: any) {
        const updatedOrder = this.prismaService.order.update({
            where: { id: orderId },
            data: {
                Shipping: {
                    update: {
                        expeditionNumber: shippingInfos.expeditionNumber,
                        stickerUrl: shippingInfos.urlEtiquette
                    }
                }
            },
            include: {
                Payment: true,
                Shipping: true
            }
        });

        return updatedOrder;
    }

    async getMyUpdatedOrder(userId: string, orderId: string) {
        const order = await this.getUserOrderByIdWithDetails(userId, orderId);

        await this.paymentService.checkAndUpdatePaymentStatus(orderId);
        await this.shippingService.checkAndUpdateShippingStatus(orderId);

        //// OrderStatus: PENDING, CANCELLED, FINISHED
        // set CANCELLED
        if (
            order.Payment?.status === PaymentStatus.EXPIRED ||
            order.Shipping.status === ShippingStatus.CANCELLED
        )
            return await this.updateOrderStatus(orderId, OrderStatus.CANCELLED);

        // set FINISHED
        if (
            order.Payment?.status === PaymentStatus.COMPLETE &&
            order.Shipping.status === ShippingStatus.RETRIEVED
        )
            return await this.updateOrderStatus(orderId, OrderStatus.FINISHED);

        // set PENDING
        return await this.updateOrderStatus(orderId, OrderStatus.PENDING);

    }

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        const updatedOrder = await this.prismaService.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                Item: {
                    include: {
                        User: true
                    }
                },
                Payment: true,
                Shipping: true
            }
        });
        return updatedOrder;
    }

}
