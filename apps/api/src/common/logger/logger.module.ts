import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('ParaShootingAPI', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        // Add other transports here (e.g., File, Http) for production
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
