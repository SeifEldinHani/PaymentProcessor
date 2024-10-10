import { TransactionDTO } from "proto/payment_processor";
import { TransactionProcessor } from "./transaction_processor.service";
import { TransactionProcessorA } from "./transaction_processor_a.service";
import { TransactionProcessorB } from "./transaction_processor_b.service";

export class TransactionProcessorFactory {
    static createTransactionProcessor(transaction: TransactionDTO): TransactionProcessor{
        switch(transaction.transactionProcessor) {
            case 'A': 
                return new TransactionProcessorA();
            case 'B': 
                return new TransactionProcessorB();
            default: 
                throw new Error("Unimplmeneted Transaction Processor")
        }

    }
}