import { Op } from "sequelize";
import { TransactionProcessor, TransactionStatus } from "./transaction_processor.service";
import { TransactionDTO } from "proto/payment_processor";
const { Transaction, Card } = require("/models");

export class TransactionProcessorB extends TransactionProcessor{

    private currencyMapper: Map<String, String> = new Map<String, String>([
        ["682", "AED"]
    ])
    private networkMapper: Map<String, String> = new Map<String, String>([
        ["MC", "MASTERCARD"]
    ])

    protected async createTransaction(transactionDTO: TransactionDTO){
        await Transaction.create(
            {
                id: transactionDTO.id,
                transaction_status: TransactionStatus.AUTHORIZED,
                transaction_origin_id: transactionDTO.transactionOriginId,
                network: this.networkMapper.get(transactionDTO.network),
                merchant_name: transactionDTO.merchantName,
                authorization_transaction_amount: parseFloat(transactionDTO.transactionAmount),
                transaction_currency: this.currencyMapper.get(transactionDTO.transactionCurrency),
                authorization_timestamp: new Date(transactionDTO.transactionTimestamp),
            }
        )
    }

    protected async createCard(transactionOriginId: string){
        await Card.create({
            id: transactionOriginId,
            utilization: 0,
            limit: 2000000              
        })
    }
}
