import { Module } from '@nestjs/common';
import { UUIDService } from './uuid/uuid.service';

@Module({
  providers: [UUIDService],
  exports: [UUIDService],
})
export class CommonModule { }
