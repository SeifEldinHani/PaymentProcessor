import { Module } from '@nestjs/common';
import { PaymentProcessorController } from './payment_processor.controller';
import { PaymentProcessorService } from './payment_processor.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilizationEventListener } from './event_listeners/utilization_event_listener.service';


@Module({
  imports: [
    EventEmitterModule.forRoot()    
  ],
  controllers: [PaymentProcessorController],
  providers: [PaymentProcessorService, UtilizationEventListener],
})
export class PaymentProcessorModule {}
