import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionDTO } from 'proto/payment_processor';
import { delay } from 'rxjs';
const { Card } = require("/models");


@Injectable()
export class UtilizationEventListener {
  @OnEvent('transaction.processed')
  async calculateCardUtiliation(transaction: TransactionDTO) {
    const card = await Card.findOne({
        where: {
            id: transaction.transactionOriginId
        }
    })

    var total_spent: number = card.total_spent + parseFloat(transaction.transactionAmount)
    var utilization: number = total_spent / card.limit * 100 

    await Card.update(
        {
            total_spent: total_spent,
            utilization: utilization
        },
        {
            where: {
                id: transaction.transactionOriginId
            }
        }
    )

    console.log(`Card: ${transaction.transactionOriginId} utilization for ${transaction.transactionType} transaction has been processed`)
    this.processTransactionSideEffects(transaction)
  }

  private processTransactionSideEffects(transaction: TransactionDTO){
    if (transaction.transactionType == 'Authorization'){
        console.log("Sending User Notification...")
    }
    else{
        console.log("Sending Anaytlics Data...")
    }
  }

}
