import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadsService } from './downloads.service';
import { DownloadsController } from './downloads.controller';
import { Download } from './entities/download.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Download])],
  controllers: [DownloadsController],
  providers: [DownloadsService],
})
export class DownloadsModule {}
