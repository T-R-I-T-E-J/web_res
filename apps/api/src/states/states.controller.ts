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
import { StatesService } from './states.service.js';
import { CreateStateDto } from './dto/create-state.dto.js';
import { UpdateStateDto } from './dto/update-state.dto.js';
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

@Controller('states')
export class StatesController {
  constructor(
    private readonly statesService: StatesService,
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
    return this.statesService.findAll(activeOnly);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statesService.findOne(+id);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Post()
  async create(
    @Body() createStateDto: CreateStateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const state = await this.statesService.create(createStateDto);

    // Audit log
    await this.auditService.log({
      userId: user.id,
      action: AuditAction.CREATE,
      tableName: 'state_association',
      recordId: state.id,
      newValues: state as unknown as Record<string, any>,
    });

    return state;
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const existing = await this.statesService.findOne(+id);
    const updated = await this.statesService.update(+id, updateStateDto);

    // Audit log
    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      tableName: 'state_association',
      recordId: +id,
      oldValues: existing as unknown as Record<string, any>,
      newValues: updated as unknown as Record<string, any>,
    });

    return updated;
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const existing = await this.statesService.findOne(+id);
    await this.statesService.remove(+id);

    // Audit log
    await this.auditService.log({
      userId: user.id,
      action: AuditAction.DELETE,
      tableName: 'state_association',
      recordId: +id,
      oldValues: existing as unknown as Record<string, any>,
    });

    return { message: 'State association deleted successfully' };
  }
}
