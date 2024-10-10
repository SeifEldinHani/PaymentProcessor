import { Injectable } from '@nestjs/common';
import { GetTransactionDTO, TransactionDTO, Transactions } from 'proto/payment_processor';
const { Transaction } = require("/models");
import { TransactionProcessorFactory } from './transaction_processor/transaction_processor_factory.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PaymentProcessorService {

  constructor(private eventEmitter: EventEmitter2) {}

  async getTransactions(): Promise<Transactions> {
    const transactions = await Transaction.findAll({})
    return {Transactions: this.toTransactionsDTO(transactions)}
  }
  async processTransaction(transactionDTO: TransactionDTO) {
    const transactionProcessor = TransactionProcessorFactory.createTransactionProcessor(transactionDTO)
    try{
      await transactionProcessor.processTransaction(transactionDTO)
      this.eventEmitter.emitAsync('transaction.processed', transactionDTO)
      console.log("Transaction processed, Event emitted")

    }
    catch (error) {
      console.log(`Error processing transaction: ${transactionDTO.id}, ${error.message} `, error.stack)
    }

  }

  private toTransactionsDTO(transactions: any) : GetTransactionDTO[] {
    return transactions.map((transaction) => ({
      id: transaction.id,
      transactionOriginId: transaction.transaction_origin_id,
      network: transaction.network,
      merchantName: transaction.merchant_name,
      authTransactionAmount: transaction.authorization_transaction_amount,
      clearingTransactionAmount: transaction.clearing_transaction_amount,
      transactionCurrency: transaction.clearing_transaction_amount,
      authTransactionTimestamp: transaction.authorization_timestamp,
      clearingTransactionTimestamp: transaction.authorization_timestamp,
    }))
  }
}
