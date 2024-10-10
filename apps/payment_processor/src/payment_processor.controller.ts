import { Controller} from '@nestjs/common';
import { PaymentProcessorService } from './payment_processor.service';
import { GrpcMethod } from '@nestjs/microservices';
import { TransactionDTO } from 'proto/payment_processor';

@Controller()
export class PaymentProcessorController{
  constructor(private readonly paymentProcessorService: PaymentProcessorService) {}
  
  @GrpcMethod('PaymentProcessorService', 'GetTransactions')
  async getTransactions(){
    return await this.paymentProcessorService.getTransactions()
  }

  @GrpcMethod('PaymentProcessorService', 'ProcessTransaction')
  async processTransaction(transactionDTO: TransactionDTO){
    await this.paymentProcessorService.processTransaction(transactionDTO)
  }
}
