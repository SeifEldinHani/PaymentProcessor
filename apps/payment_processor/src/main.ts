import { NestFactory } from '@nestjs/core';
import { PaymentProcessorModule } from './payment_processor.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentProcessorModule,
    {
      transport: Transport.GRPC, 
      options: {
        url: 'payment_processor:5000',
        protoPath: 'proto/payment_processor.proto',
        package: 'payment_processor'
      }
    }
  
  );
  await app.listen();
}
bootstrap();
