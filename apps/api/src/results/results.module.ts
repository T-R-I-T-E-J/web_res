import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsController } from './results.controller';
import { ResultsService } from './services/results.service';
import { StorageService } from './services/storage.service';
import { Result } from './entities/result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  controllers: [ResultsController],
  providers: [ResultsService, StorageService],
  exports: [ResultsService, StorageService],
})
export class ResultsModule {}
