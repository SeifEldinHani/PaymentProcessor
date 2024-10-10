import { TransactionMapper, TransactionType } from "./transaction_mapper.interface";
import { TransactionDTO } from "proto/payment_processor";



export class TransactionMapperB implements TransactionMapper{
    toTransactionDTO(transaction: any): TransactionDTO {
        
        const transaction_type = this.getTransactionType(transaction.type)
        const transactionDto: TransactionDTO ={
            id: transaction.transaction.id,
            transactionOriginId: transaction.transaction.account_id,
            network: transaction.transaction.details.network,
            transactionType: transaction_type,
            transactionProcessor: 'B',
            merchantName: transaction.transaction.details.scheme_acceptor_name,
            transactionAmount: String(transaction.transaction.details.scheme_billing_amount),
            transactionCurrency: transaction.transaction.details.scheme_billing_currency,
            transactionTimestamp: transaction.transaction.created_at
        }
        return transactionDto;
    }

    private getTransactionType(message_type: string): TransactionType {
        return message_type === "ACCOUNT_TRANSACTION_CREATED" ? TransactionType.Authorization : TransactionType.Clearing
    }
}
