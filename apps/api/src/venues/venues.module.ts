import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesService } from './venues.service.js';
import { VenuesController } from './venues.controller.js';
import { Venue } from './entities/venue.entity.js';
import { AuditLog } from '../common/entities/audit-log.entity.js';
import { AuditService } from '../common/services/audit.service.js';
import { Role } from '../auth/entities/role.entity.js';
import { UserRole } from '../auth/entities/user-role.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, AuditLog, Role, UserRole])],
  controllers: [VenuesController],
  providers: [VenuesService, AuditService],
  exports: [VenuesService],
})
export class VenuesModule {}
