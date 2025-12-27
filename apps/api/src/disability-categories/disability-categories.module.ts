import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisabilityCategoriesService } from './disability-categories.service.js';
import { DisabilityCategoriesController } from './disability-categories.controller.js';
import { DisabilityCategory } from './entities/disability-category.entity.js';
import { AuditLog } from '../common/entities/audit-log.entity.js';
import { AuditService } from '../common/services/audit.service.js';
import { Role } from '../auth/entities/role.entity.js';
import { UserRole } from '../auth/entities/user-role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DisabilityCategory,
      AuditLog,
      Role,
      UserRole,
    ]),
  ],
  controllers: [DisabilityCategoriesController],
  providers: [DisabilityCategoriesService, AuditService],
  exports: [DisabilityCategoriesService],
})
export class DisabilityCategoriesModule {}
