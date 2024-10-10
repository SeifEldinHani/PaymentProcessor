import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api_gateway.module';
import 'reflect-metadata';


async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(3000);
}
bootstrap();
