import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class TemplateService {

    async getTemplate(templateName: string): Promise<string> {
        try {
            const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);

            const templateContent = await fs.promises.readFile(templatePath, 'utf8');

            return templateContent;
        } catch (error) {
            return null;            
        }
    }


    replaceDataInMailTemplate(template: string, data: any): string {
        for (const key in data)
            template = template.replace(`{{${key}}}`, data[key]);

        return template;
    }

    transformTemplateToText(template: string): string {
        return template.replace(/<[^>]*>/g, '');
    }

}
