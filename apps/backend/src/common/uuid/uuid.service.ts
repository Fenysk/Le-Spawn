import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UUIDService {

    getNewUUID(prefix: string): string {
        const uuid = uuidv4();
                
        const clearUuid = uuid.replace(/-/g, '');

        const tinyUuid = clearUuid.slice(0, 8);
        
        const newUuid = `${prefix}_${tinyUuid}`;
        
        return newUuid;
    }
}
