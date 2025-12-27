import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseBoolPipe,
} from '@nestjs/common';
import { DisabilityCategoriesService } from './disability-categories.service.js';
import { CreateDisabilityCategoryDto } from './dto/create-disability-category.dto.js';
import { UpdateDisabilityCategoryDto } from './dto/update-disability-category.dto.js';
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

@Controller('disability-categories')
export class DisabilityCategoriesController {
  constructor(
    private readonly categoriesService: DisabilityCategoriesService,
    private readonly auditService: AuditService,
  ) {}

  @Public()
  @Get()
  findAll(
    @Query('activeOnly', new ParseBoolPipe({ optional: true }))
    activeOnly?: boolean,
  ) {
    if (activeOnly === undefined) {
      activeOnly = true;
    }
    return this.categoriesService.findAll(activeOnly);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Post()
  async create(
    @Body() createDto: CreateDisabilityCategoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const category = await this.categoriesService.create(createDto);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.CREATE,
      entityType: 'disability_category',
      entityId: category.id.toString(),
      newValues: category as unknown as Record<string, any>,
    });

    return category;
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDisabilityCategoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const existing = await this.categoriesService.findOne(+id);
    const updated = await this.categoriesService.update(+id, updateDto);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: 'disability_category',
      entityId: id,
      oldValues: existing as unknown as Record<string, any>,
      newValues: updated as unknown as Record<string, any>,
    });

    return updated;
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const existing = await this.categoriesService.findOne(+id);
    await this.categoriesService.remove(+id);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.DELETE,
      entityType: 'disability_category',
      entityId: id,
      oldValues: existing as unknown as Record<string, any>,
    });

    return { message: 'Category deleted successfully' };
  }
}
