import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShootersService } from './shooters.service.js';
import { ShootersController } from './shooters.controller.js';
import { Shooter } from './entities/shooter.entity.js';
import { ShooterClassification } from './entities/shooter-classification.entity.js';
import { StateAssociation } from '../states/entities/state-association.entity.js';
import { User } from '../users/entities/user.entity.js';
import { AuditLog } from '../common/entities/audit-log.entity.js';
import { AuditService } from '../common/services/audit.service.js';
import { Role } from '../auth/entities/role.entity.js';
import { UserRole } from '../auth/entities/user-role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shooter,
      ShooterClassification,
      StateAssociation,
      User,
      AuditLog,
      Role,
      UserRole,
    ]),
  ],
  controllers: [ShootersController],
  providers: [ShootersService, AuditService],
  exports: [ShootersService],
})
export class ShootersModule {}
