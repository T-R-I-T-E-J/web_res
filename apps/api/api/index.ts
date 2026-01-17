import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/setup';
import type { IncomingMessage, ServerResponse } from 'http';

// Define the Express server type (request listener)
type ExpressInstance = (req: IncomingMessage, res: ServerResponse) => void;

let cachedServer: ExpressInstance;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance() as ExpressInstance;
  }
  return cachedServer(req, res);
}
