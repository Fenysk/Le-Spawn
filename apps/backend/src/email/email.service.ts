import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ResendService } from './services/resend.service';
import { TemplateService } from './services/template.service';

@Injectable()
export class EmailService {
    constructor
        (
            private readonly resendService: ResendService,
            private readonly templateService: TemplateService,
            private readonly configService: ConfigService
        ) { }

    async sendEmailConfirmation(user: User): Promise<string> {
        const from = this.configService.get<string>('RESEND_FROM_ADDRESS')
        const subject = 'Confirm your email address'

        const APP_URL = this.configService.get<string>('APP_URL')
        const confirmationId = uuidv4();

        const emailDataToReplace = {
            confirmation_link: `${APP_URL}/bienvenue/confirmer-email/${confirmationId}`,
        }


        const template = await this.templateService.getTemplate('confirmation')

        const htmlEmail = this.templateService.replaceDataInMailTemplate(template, emailDataToReplace)
        const textEmail = this.templateService.transformTemplateToText(htmlEmail)

        const confirmationEmail = {
            from,
            to: [user.email],
            subject,
            text: textEmail,
            html: htmlEmail,
        }

        const resendInstance = this.resendService.createResendInstance();
        const response = await resendInstance.emails.send(confirmationEmail)

        return confirmationId;
    }

    async sendEmailWelcome(user: User & { Profile: Profile }): Promise<any> {
        const from = this.configService.get<string>('RESEND_FROM_ADDRESS')
        const subject = 'Welcome to Play & Swap'

        const nickName = user.Profile.nickName || 'nouveau joueur'

        const emailDataToReplace = { nickName }

        const template = await this.templateService.getTemplate('welcome')

        const htmlEmail = this.templateService.replaceDataInMailTemplate(template, emailDataToReplace)
        const textEmail = this.templateService.transformTemplateToText(htmlEmail)

        const welcomeEmail = {
            from,
            to: [user.email],
            subject,
            text: textEmail,
            html: htmlEmail,
        }

        const resendInstance = this.resendService.createResendInstance();
        await resendInstance.emails.send(welcomeEmail)
    }

}
