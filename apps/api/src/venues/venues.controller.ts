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
import { VenuesService } from './venues.service.js';
import { CreateVenueDto } from './dto/create-venue.dto.js';
import { UpdateVenueDto } from './dto/update-venue.dto.js';
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

@Controller('venues')
export class VenuesController {
  constructor(
    private readonly venuesService: VenuesService,
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
    return this.venuesService.findAll(activeOnly);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(+id);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Post()
  async create(
    @Body() createVenueDto: CreateVenueDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const venue = await this.venuesService.create(createVenueDto);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.CREATE,
      tableName: 'venue',
      recordId: venue.id,
      newValues: venue as unknown as Record<string, any>,
    });

    return venue;
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const existing = await this.venuesService.findOne(+id);
    const updated = await this.venuesService.update(+id, updateVenueDto);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      tableName: 'venue',
      recordId: +id,
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
    const existing = await this.venuesService.findOne(+id);
    await this.venuesService.remove(+id);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.DELETE,
      tableName: 'venue',
      recordId: +id,
      oldValues: existing as unknown as Record<string, any>,
    });

    return { message: 'Venue deleted successfully' };
  }
}
