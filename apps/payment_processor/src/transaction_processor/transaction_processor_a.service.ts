import { Op } from "sequelize";
import { TransactionProcessor, TransactionStatus } from "./transaction_processor.service";
import { TransactionDTO } from "proto/payment_processor";
const { Transaction, Card } = require("/models");

export class TransactionProcessorA extends TransactionProcessor{
    protected async createTransaction(transactionDTO: TransactionDTO){
        await Transaction.create(
            {
                id: transactionDTO.id,
                transaction_status: TransactionStatus.AUTHORIZED,
                transaction_origin_id: transactionDTO.transactionOriginId,
                network: transactionDTO.network,
                merchant_name: transactionDTO.merchantName,
                authorization_transaction_amount: parseFloat(transactionDTO.transactionAmount),
                transaction_currency: transactionDTO.transactionCurrency,
                authorization_timestamp: new Date(transactionDTO.transactionTimestamp),
            }
        )
    }

    protected async createCard(transactionOriginId: string){
        await Card.create({
            id: transactionOriginId,
            utilization: 0,
            limit: 1000000              
        })
    }
}
