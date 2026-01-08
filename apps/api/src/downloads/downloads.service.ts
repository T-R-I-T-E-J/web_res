import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Download, DownloadCategory } from './entities/download.entity';
import { CreateDownloadDto } from './dto/create-download.dto';

@Injectable()
export class DownloadsService implements OnModuleInit {
  private readonly logger = new Logger(DownloadsService.name);

  constructor(
    @InjectRepository(Download)
    private downloadRepository: Repository<Download>,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  async create(createDownloadDto: CreateDownloadDto): Promise<Download> {
    const download = this.downloadRepository.create(createDownloadDto);
    return this.downloadRepository.save(download);
  }

  async findAll(category?: string): Promise<Download[]> {
    if (category) {
      return this.downloadRepository.find({
        where: { category, isActive: true },
        order: { createdAt: 'DESC' },
      });
    }
    return this.downloadRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Download> {
    const download = await this.downloadRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!download) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(`Download with ID "${id}" not found`);
    }
    return download;
  }

  async getCategories(): Promise<string[]> {
    const result = await this.downloadRepository
      .createQueryBuilder('download')
      .select('DISTINCT download.category', 'category')
      .getRawMany<{ category: string }>();
    return result.map((r) => r.category).filter(Boolean);
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log(`Attempting to remove download with id: ${id}`);
    const result = await this.downloadRepository.delete(id);

    if (result.affected === 0) {
      this.logger.warn(`Download with id ${id} not found for deletion`);
      // We can throw an error or just return a message.
      // Throwing NotFoundException is better for API semantics.
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(`Download with ID "${id}" not found`);
    }

    this.logger.log(`Successfully removed download with id: ${id}`);
    return { message: 'Download deleted successfully' };
  }

  private async seedInitialData() {
    const count = await this.downloadRepository.count();
    if (count > 0) return;

    this.logger.log('Seeding initial downloads data...');

    const rules = [
      {
        title: 'Para Shooting Criteria',
        description: 'Official Para Shooting criteria and guidelines document',
        fileType: 'PDF',
        href: '/para-shooting-criteria.pdf',
        category: DownloadCategory.RULES,
      },
      {
        title: 'WSPS Rulebook 2026',
        description:
          'Official World Shooting Para Sport Rulebook - Final Version',
        fileType: 'PDF',
        size: 'External',
        href: 'https://www.paralympic.org/sites/default/files/2025-12/WSPS%20Rulebook%202026_vFinal_0.pdf',
        category: DownloadCategory.RULES,
      },
      {
        title: 'WSPS Rulebook Appendices 2026',
        description: 'Appendices to the Official WSPS Rulebook 2026',
        fileType: 'PDF',
        size: 'External',
        href: 'https://www.paralympic.org/sites/default/files/2025-12/WSPS%20Rulebook%20Appendices%202026_vFinal.pdf',
        category: DownloadCategory.RULES,
      },
      {
        title: 'Details for IPC Card & License',
        description: 'Details regarding IPC Card and IPC License',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/details-for-ipc-card-ipc-license/',
        category: DownloadCategory.RULES,
      },
      {
        title: 'State Association Email IDs',
        description: 'Contact details for State Associations',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/state-association-email-id/',
        category: DownloadCategory.RULES,
      },
    ];

    const selectionPolicies = [
      {
        title: '2025 National Selection Policy',
        description: 'National Selection Policy for Para Shooting - 2025',
        fileType: 'PDF',
        href: '/2025-national-selection-policy.pdf',
        category: DownloadCategory.SELECTION,
      },
      {
        title: 'Selection Policy - Paris 2024 Paralympics',
        description:
          'Selection criteria for Paris France 2024 Paralympic Games',
        fileType: 'PDF',
        href: '/selection-policy-paris-2024.pdf',
        category: DownloadCategory.SELECTION,
      },
      {
        title: 'Selection Policy - Tokyo 2020 Paralympics',
        description: 'Selection criteria for Tokyo Japan 2020 Paralympic Games',
        fileType: 'PDF',
        href: '/selection-policy-tokyo-2020.pdf',
        category: DownloadCategory.SELECTION,
      },
      {
        title: 'Selection Committee Meeting',
        description: 'Selection Committee Meeting details/download',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/selection-committee-meeting-',
        category: DownloadCategory.SELECTION,
      },
    ];

    const eventCalendar = [
      {
        title: '2026-2027 Para Shooting Event Calendar',
        description:
          'Official event calendar for Para Shooting competitions 2026-2027',
        fileType: 'PDF',
        href: '/2026-2027-event-calendar.pdf',
        category: DownloadCategory.CALENDAR,
      },
    ];

    const matchDocuments = [
      {
        title: 'Match Book - Zonal & National Championship 2022',
        description:
          'Match book for Zonal and National Para Shooting Championship 2022',
        fileType: 'PDF',
        href: '/match-book-2022.pdf',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'NOTICE for WSPS Grand Prix',
        description: 'Notice for WSPS Grand Prix',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/notice-for-wsps-grand-prix-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Results – 6th National Para',
        description: 'Results for 6th National Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/results-6th-national-para-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Circular – 6th Zonal Para',
        description: 'Circular for 6th Zonal Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/circular-6th-zonal-para-shooting-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Results – 6th Zonal Para',
        description: 'Results for 6th Zonal Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/results-6th-zonal-para-shooting-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'SCHEDULE & DETAIL',
        description: 'Schedule & Detail Sheet for 6th Zonal',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/schedule-detail-sheet-6th-zonal-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Circular – 6th National',
        description: 'Circular for 6th National Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/circular-6th-national-para-',
        category: DownloadCategory.MATCH,
      },
    ];

    const allDownloads = [
      ...rules,
      ...selectionPolicies,
      ...eventCalendar,
      ...matchDocuments,
    ];

    for (const item of allDownloads) {
      await this.downloadRepository.save(item);
    }

    this.logger.log(`Seeded ${allDownloads.length} download items.`);
  }
}
