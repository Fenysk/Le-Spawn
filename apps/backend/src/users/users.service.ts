import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Address, PersonalInformation, Profile, Role, User } from '@prisma/client';
import * as argon2 from "argon2";
import { AddressesService } from 'src/addresses/addresses.service';
import { UUIDService } from 'src/common/uuid/uuid.service';
import { PrismaService } from '../prisma/prisma.service';
import { InputUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly UUIDService: UUIDService,

        @Inject(forwardRef(() => AddressesService))
        private readonly addressesService: AddressesService
    ) { }

    async getAllUsers(): Promise<object[]> {
        const users = await this.prismaService.user.findMany();

        if (!users.length) {
            throw new NotFoundException('No users found');
        }

        users.forEach(user => delete user.hashedPassword);

        return users;
    }

    async getUserById(id: string): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: {
                Addresses: true,
                Profile: true,
                PersonalInformation: true,
            }
        });

        if (!user)
            throw new NotFoundException('User not found');

        const { hashedPassword, ...publicUser } = user;

        return publicUser;
    }

    async getMyProfile(id: string): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: {
                Addresses: true,
                Profile: true,
                PersonalInformation: true,
                Collections: true
            }
        });

        if (!user)
            throw new NotFoundException('User not found');

        const { hashedPassword, refreshToken, confirmationId, confirmed, ...publicUser } = user;

        return publicUser;
    }

    async getUserByEmail(email: string): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: { email }
        });

        return user;
    }

    async getUserByConfirmationId(confirmationId: string): Promise<any> {
        const user = await this.prismaService.user.findFirst({
            where: { confirmationId },
            include: {
                Profile: true
            }
        });

        return user;
    }

    async createUser(data: InputUserDto): Promise<object> {
        const userId = this.UUIDService.getNewUUID('user');
        const collectionId = this.UUIDService.getNewUUID('clcn');

        const newUser = await this.prismaService.user.create({
            data: {
                id: userId,
                email: data.email,
                hashedPassword: data.hashedPassword,

                Profile: {
                    create: {
                        nickName: data.nickName
                    }
                },

                PersonalInformation: {
                    create: {}
                },

                Collections: {
                    create: {
                        id: collectionId,
                        name: `Collection de ${data.nickName}`
                    }
                }
            },
            include: {
                Profile: true,
                PersonalInformation: true,
                Collections: true
            }
        });
        return newUser;
    }

    async updateUser(id: string, data: any): Promise<object> {
        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data
        });
        return updatedUser;
    }

    async updateMyProfile(id: string, data: any): Promise<object> {
        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: {
                Profile: {
                    update: {
                        data
                    }
                }
            },
            include: {
                Profile: true,
                PersonalInformation: true,
                Collections: true
            }
        });

        return updatedUser;
    }

    async updateMyPersonalInformations(id: string, data: any): Promise<object> {
        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: {
                PersonalInformation: {
                    update: {
                        data
                    }
                }
            },
        });

        return updatedUser;
    }

    async updateMyPassword(id: string, data: any): Promise<object> {
        const { oldPassword, newPassword } = data;

        const user = await this.prismaService.user.findUnique({
            where: { id }
        });

        const isPasswordValid = await argon2.verify(user.hashedPassword, oldPassword);

        if (!isPasswordValid)
            throw new ForbiddenException('Error updating password');

        const hashedPassword = await argon2.hash(newPassword);

        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: { hashedPassword }
        });

        return updatedUser;
    }

    async becomeSeller(userId: string, defaultSellerAddressId: string): Promise<object> {
        const user: User & { PersonalInformation: PersonalInformation, Profile: Profile, Addresses: Address } = await this.getUserById(userId);

        if (!user.PersonalInformation.firstName)
            throw new ForbiddenException('You must provide your first name before becoming a seller');

        if (!user.PersonalInformation.lastName)
            throw new ForbiddenException('You must provide your last name before becoming a seller');

        if (user.roles.includes('SELLER'))
            throw new ConflictException('You are already a seller');

        const address = await this.addressesService.getAddressById(defaultSellerAddressId);

        const roles = [...user.roles, Role.SELLER] as Role[];

        const updatedUser = await this.prismaService.user.update({
            where: { id: userId },
            data: {
                defaultSellerAddressId: address.id,
                roles
            }
        });

        return updatedUser;
    }

    async becomeAdmin(userId: string): Promise<object> {
        const users = await this.prismaService.user.findMany();

        if (users.length > 1)
            throw new ForbiddenException('You must be the first user to become an admin');

        const firstUser = users[0];

        if (firstUser.roles.includes('ADMIN'))
            throw new ConflictException('You are already an admin');

        const roles = [...firstUser.roles, 'ADMIN'] as Role[];

        const updatedUser = await this.prismaService.user.update({
            where: { id: userId },
            data: { roles }
        });

        return updatedUser;
    }

    async deleteFullUser(id: string): Promise<string> {
        try {
            const deletedUserProfile = await this.prismaService.profile.delete({
                where: { userId: id }
            });

            const deletedUserPersonalInformation = await this.prismaService.personalInformation.delete({
                where: { userId: id }
            });

            const deletedUserCollections = await this.prismaService.collection.deleteMany({
                where: { userId: id }
            });

            const deletedUser = await this.prismaService.user.delete({
                where: { id }
            });

            const deletedUserAddresses = await this.prismaService.address.deleteMany({
                where: { userId: id }
            });

            console.log(`User ${deletedUser.email} deleted`)
            
            return `${deletedUser.email} deleted`;
        } catch (error) {
            console.log(error);
        }

    }
}
