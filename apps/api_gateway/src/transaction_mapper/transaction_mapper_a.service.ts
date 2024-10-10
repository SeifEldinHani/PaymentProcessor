import { TransactionMapper, TransactionType } from "./transaction_mapper.interface";
import { TransactionDTO } from "proto/payment_processor";



export class TransactionMapperA implements TransactionMapper{
    toTransactionDTO(transaction: any): TransactionDTO {
        
        const transaction_type = this.getTransactionType(transaction.message_type)
        const transaction_id = this.getTransactionId(transaction_type, transaction)
        const transactionDto: TransactionDTO ={
            id: transaction_id,
            transactionOriginId: transaction.card_id,
            network: transaction.network,
            transactionType: transaction_type,
            transactionProcessor: 'A',
            merchantName: transaction.merchant_name,
            transactionAmount: String(transaction.transaction_amount),
            transactionCurrency: transaction.transaction_currency,
            transactionTimestamp: transaction.transaction_timestamp
        }
        return transactionDto;
    }

    private getTransactionType(message_type: string): TransactionType {
        return message_type === "AUTHORIZATION" ? TransactionType.Authorization : TransactionType.Clearing
    }

    private getTransactionId(transaction_type: TransactionType, transaction: any): string {
        return transaction_type === TransactionType.Authorization ? transaction.id : transaction.parent_transaction_id
    }
}
