import { TransactionDTO } from "proto/payment_processor";
import { Op } from "sequelize";
const { Transaction, Card } = require("/models");


export enum TransactionStatus {
    AUTHORIZED = 'Authorized', 
    CLEARED = 'Cleared'
}

export abstract class TransactionProcessor {

   
    protected abstract createTransaction(transactionDTO: TransactionDTO)
    protected abstract createCard(transactionOriginId: string)

    public async processTransaction(transactionDTO: TransactionDTO) {
        if (transactionDTO.transactionType == 'Authorization'){
            await this.createTransaction(transactionDTO).catch(async (error) =>{ 
                if (error.name === "SequelizeForeignKeyConstraintError")
                {
                    await this.createCardAndTransaction(transactionDTO)
                    return 
                }
                console.log(`Error Creating transaction: ${transactionDTO.id}, `, error.message, error.stack)
                throw error
            })
        }
        else {
            const affectedCount = await this.updateTransaction(transactionDTO).catch((error) =>{ 
                console.log(`Error Updating transaction: ${transactionDTO.id}`, error.message, error.stack)
                throw error
            })
            if (!affectedCount){
                console.log("Transaction Already Cleared!")
                throw new Error("Duplicate Clearing Transasctions")
            }
        }
    }

    private async createCardAndTransaction(transactionDTO: TransactionDTO){
        await this.createCard(transactionDTO.transactionOriginId).catch(error =>{
            console.log(`Error Creating card with Id: ${transactionDTO.transactionOriginId}`)
            throw error
        })

        await this.createTransaction(transactionDTO).catch(error => {
            console.log(`Error Creating transaction: ${transactionDTO.id}, `, error.name, error.stack)
            throw error
        })
    }

    private async updateTransaction(transactionDTO: TransactionDTO): Promise<number> {
        const [affectedCount] = await Transaction.update(
            {
                transaction_status: TransactionStatus.CLEARED,
                clearing_transaction_amount: parseFloat(transactionDTO.transactionAmount),
                clearing_timestamp: new Date(transactionDTO.transactionTimestamp),
            },
            {
                where: {
                    id: transactionDTO.id,
                    transaction_status: {
                        [Op.ne]: TransactionStatus.CLEARED
                    }
                }
            }
        )
        return affectedCount; 
    }

}
