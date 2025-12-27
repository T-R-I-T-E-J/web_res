import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatesService } from './states.service.js';
import { StatesController } from './states.controller.js';
import { StateAssociation } from './entities/state-association.entity.js';
import { AuditLog } from '../common/entities/audit-log.entity.js';
import { AuditService } from '../common/services/audit.service.js';
import { Role } from '../auth/entities/role.entity.js';
import { UserRole } from '../auth/entities/user-role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([StateAssociation, AuditLog, Role, UserRole]),
  ],
  controllers: [StatesController],
  providers: [StatesService, AuditService],
  exports: [StatesService],
})
export class StatesModule {}
