import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api_gateway.controller';
import { ApiGatewayService } from './api_gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'reflect-metadata';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'payment_processor',
        transport: Transport.GRPC,
        options: {
          url: 'payment_processor:5000',
          package: 'payment_processor',
          protoPath: 'proto/payment_processor.proto',
        },
      },
    ]),
  ],  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
