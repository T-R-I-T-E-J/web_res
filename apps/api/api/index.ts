import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/setup';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
}
