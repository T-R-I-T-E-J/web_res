import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ShootersService } from './shooters.service.js';
import { CreateShooterProfileDto } from './dto/create-shooter-profile.dto.js';
import { CreateShooterClassificationDto } from './dto/create-shooter-classification.dto.js';
import { UpdateShooterClassificationDto } from './dto/update-shooter-classification.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { PermissionsGuard } from '../common/guards/permissions.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';
import { AuditService } from '../common/services/audit.service.js';
import { AuditAction } from '../common/entities/audit-log.entity.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

interface AuthenticatedUser {
  id: number;
  email: string;
}

@Controller('shooters')
export class ShootersController {
  constructor(
    private readonly shootersService: ShootersService,
    private readonly auditService: AuditService,
  ) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.shootersService.findByUserId(user.id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shootersService.findOne(+id);
  }

  @Post('profile')
  async createOrUpdateProfile(
    @Body() dto: CreateShooterProfileDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const profile = await this.shootersService.createOrUpdateProfile(user, dto);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: 'shooter',
      entityId: profile.id.toString(),
      newValues: profile as unknown as Record<string, any>,
    });

    return profile;
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('users:verify')
  @Post(':id/verify')
  async verifyShooter(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const shooter = await this.shootersService.verifyShooter(+id, user.id);
    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: 'shooter',
      entityId: id,
      newValues: { verified: true, verifiedAt: new Date() },
    });

    return shooter;
  }

  @Public()
  @Get(':id/classifications')
  async getClassifications(@Param('id') id: string) {
    return this.shootersService.getClassifications(+id);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('shooters:classify')
  @Post(':id/classifications')
  async addClassification(
    @Param('id') id: string,
    @Body() dto: CreateShooterClassificationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const classification = await this.shootersService.addClassification(
      +id,
      dto,
    );

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.CREATE,
      entityType: 'shooter_classification',
      entityId: classification.id.toString(),
      newValues: classification as unknown as Record<string, any>,
    });

    return classification;
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('shooters:classify')
  @Patch('classifications/:id')
  async updateClassification(
    @Param('id') id: string,
    @Body() dto: UpdateShooterClassificationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const classification = await this.shootersService.updateClassification(
      +id,
      dto,
    );

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: 'shooter_classification',
      entityId: id,
      newValues: classification as unknown as Record<string, any>,
    });

    return classification;
  }
}
