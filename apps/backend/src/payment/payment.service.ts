import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { OrdersService } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from './services/stripe.service';

@Injectable()
export class PaymentService {
    constructor(
        private readonly stripeService: StripeService,
        private readonly prismaService: PrismaService,

        @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService
    ) { }

    async createPaymentSession(userId: string, orderId: any): Promise<any> {

        const order = await this.ordersService.getUserOrderByIdWithDetails(userId, orderId);

        if (order.Payment.status === PaymentStatus.OPEN || order.Payment.status === PaymentStatus.COMPLETE)
            throw new ConflictException('Payment session already created');

        const session = await this.stripeService.createPaymentSession(order);

        const statusIndex = {
            'open': PaymentStatus.OPEN,
            'complete': PaymentStatus.COMPLETE,
            'expired': PaymentStatus.EXPIRED,
        }

        const paymentSession = await this.prismaService.payment.update({
            where: { id: order.Payment.id },
            data: {
                sessionId: session.id,
                sessionUrl: session.url,
                status: statusIndex[session.status],
            }
        });

        return paymentSession;
    }

    async retrievePaymentSession(paymentSessionId: string): Promise<any> {
        try {
            const session = await this.stripeService.getPaymentSession(paymentSessionId);
            return session;
        } catch (error) {
            throw error
        }
    }

    async getPaymentSession(orderId: string): Promise<any> {
        const payment = await this.prismaService.payment.findUniqueOrThrow({
            where: { orderId }
        });

        return payment;
    }

    async checkAndUpdatePaymentStatus(orderId: string): Promise<any> {
        const payment = await this.getPaymentSession(orderId);

        if (!payment.sessionId)
            return payment

        const session = await this.retrievePaymentSession(payment.sessionId);

        const statusIndex = {
            'open': PaymentStatus.OPEN,
            'complete': PaymentStatus.COMPLETE,
            'expired': PaymentStatus.EXPIRED,
        }

        const updatedPayment = await this.prismaService.payment.update({
            where: { id: payment.id },
            data: {
                status: statusIndex[session.status],
                sessionUrl: session.url,
            }
        });

        return updatedPayment;
    }

}
