import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PAYMENT_PROCESSOR_SERVICE_NAME, PaymentProcessorServiceClient } from 'proto/payment_processor';
import { TransactionMapperFactory } from './transaction_mapper/transaction_mapper_factory.service';

@Injectable()
export class ApiGatewayService implements OnModuleInit {

  private paymentProcessorServiceClient: PaymentProcessorServiceClient;

  constructor(@Inject('payment_processor') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.paymentProcessorServiceClient =
      this.clientGrpc.getService<PaymentProcessorServiceClient>(PAYMENT_PROCESSOR_SERVICE_NAME);
  }

  getTransactions() {
    return this.paymentProcessorServiceClient.getTransactions({});
  }

  async postTransaction(transaction: any) {
    const transactionMapper = await TransactionMapperFactory.createTransactionMapper(transaction)
    console.log(transactionMapper)
    const transactionDTO = transactionMapper.toTransactionDTO(transaction)
    console.log("[Transaction Processor]: ", transactionDTO.transactionProcessor)
    this.paymentProcessorServiceClient.processTransaction(transactionDTO).subscribe(
      () => {
          console.log('Transaction sent successfully');
      },
      (error) => {
          console.error('Error sending transaction:', error.message);
      }
  );
  }
}
