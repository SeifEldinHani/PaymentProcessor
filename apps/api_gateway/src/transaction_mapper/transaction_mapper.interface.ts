import { TransactionDTO } from "proto/payment_processor";


export enum TransactionType {
    Authorization = 'Authorization', 
    Clearing = 'Clearing'
}

export interface TransactionMapper {
    toTransactionDTO(transaction: any): TransactionDTO; 
}
