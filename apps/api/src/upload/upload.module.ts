import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { StoredFile } from './entities/stored-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoredFile])],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
