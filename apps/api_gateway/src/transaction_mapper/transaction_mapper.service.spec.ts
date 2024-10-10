import 'reflect-metadata';  
import { TransactionMapperFactory } from "./transaction_mapper_factory.service";
import { TransactionMapperB } from './transaction_mapper_b.service';
import { TransactionMapperA } from './transaction_mapper_a.service';
describe('TransactionMapper', () => {

    it('should process using Transaction Processor A - Auth transaction', async () => {
        let jsonData = require('/test/testing_transactions/processor_a_auth.json');
        const transactionMapper = await TransactionMapperFactory.createTransactionMapper(jsonData)
        const transactionDTO = transactionMapper.toTransactionDTO(jsonData)

        expect(transactionMapper instanceof TransactionMapperA).toBe(true)
        expect(transactionDTO.transactionProcessor).toBe("A");    
    })

    it('should process using Transaction Processor A - Clearing transaction', async () => {
        let jsonData = require('/test/testing_transactions/processor_a_clear.json');
        const transactionMapper = await TransactionMapperFactory.createTransactionMapper(jsonData)
        const transactionDTO = transactionMapper.toTransactionDTO(jsonData)

        expect(transactionMapper instanceof TransactionMapperA).toBe(true)
        expect(transactionDTO.transactionProcessor).toBe("A");
    })

    it('should process using Transaction Processor B - Auth transaction', async () => {
        let jsonData = require('/test/testing_transactions/processor_b_auth.json');
        const transactionMapper = await TransactionMapperFactory.createTransactionMapper(jsonData)
        const transactionDTO = transactionMapper.toTransactionDTO(jsonData)

        expect(transactionMapper instanceof TransactionMapperB).toBe(true)
        expect(transactionDTO.transactionProcessor).toBe("B");
    })
    
    it('should process using Transaction Processor B - Clearing transaction', async () => {
        let jsonData = require('/test/testing_transactions/processor_b_clear.json');
        const transactionMapper = await TransactionMapperFactory.createTransactionMapper(jsonData)
        const transactionDTO = transactionMapper.toTransactionDTO(jsonData)
        expect(transactionMapper instanceof TransactionMapperB).toBe(true)
        expect(transactionDTO.transactionProcessor).toBe("B");
    })

    it('should throw an error and detect no payment processor', async () => {
        const jsonData = {
            transactionId: "transactionId-test"
        };
        await expect(TransactionMapperFactory.createTransactionMapper(jsonData)).rejects.toThrow("Unrecognized Payment Processor Schema");
    });

});
