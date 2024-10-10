import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDTO } from 'proto/payment_processor';
import { PaymentProcessorController } from './payment_processor.controller';
import { PaymentProcessorService } from './payment_processor.service';
import { UtilizationEventListener } from './event_listeners/utilization_event_listener.service';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionStatus } from './transaction_processor/transaction_processor.service';
const { Transaction, Card } = require("/models");

const Sequelize = require('sequelize');

async function waitForCardUpdate(cardId: string, expectedSpent: number){
  const endTime = Date.now() + 5000;

  while (Date.now() < endTime) {
    const card = await Card.findOne({ where: { id: cardId } });
    if (card && card.total_spent === expectedSpent) {
      console.log("Card total spending Asserted!")
      return; 
    }
    await new Promise(resolve => setTimeout(resolve, 100)); 
  }
  throw new Error(`Card was not updated to the expected value within 5000ms`);
}

describe('PaymentProcessorController', () => {
  let sequelize = new Sequelize({
    "username": "admin",
    "password": "admin",
    "database": "payment_processor_db",
    "host": "db",
    "dialect": "postgres",
    "port": 5432,
    "logging": false,
    "models" : "/models"
  });
  let controller: PaymentProcessorController;
  let eventEmitter: any
  let app:any; 


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot()    
      ],
      controllers: [PaymentProcessorController],
      providers: [PaymentProcessorService, UtilizationEventListener],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    controller = moduleFixture.get<PaymentProcessorController>(PaymentProcessorController);
    eventEmitter = moduleFixture.get<EventEmitter2>(EventEmitter2);
    await sequelize.sync({ force: true });
    await Card.truncate({ cascade: true });
  });

  afterEach(async () => {
    await Card.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('PaymentProcessorController.processTransaction', () => {
    it('should process Auth and Clearing Transactions and create a card', async () => {
      const authTransactionDTO: TransactionDTO = {
        id: 'transaction-id-1',
        transactionOriginId: 'card-1',
        transactionProcessor: "A",
        transactionType: "Authorization",
        network: 'VISA',
        merchantName: 'Test Merchant',
        transactionAmount: '100',
        transactionCurrency: 'AED',
        transactionTimestamp: new Date().toISOString(),
      };
      const clearingTransactionDTO: TransactionDTO = {
        id: 'transaction-id-1',
        transactionOriginId: 'card-1',
        transactionProcessor: "A",
        transactionType: "Clearing",
        network: 'VISA',
        merchantName: 'Test Merchant',
        transactionAmount: '100',
        transactionCurrency: 'AED',
        transactionTimestamp: new Date().toISOString(),
      };
  
      await controller.processTransaction(authTransactionDTO);
      await controller.processTransaction(clearingTransactionDTO);
      
      const transactions = await Transaction.findAll();
  
  
      const cards = await Card.findAll();
  
      expect(transactions.length).toBe(1);
      expect(transactions[0].id).toBe('transaction-id-1');
      expect(transactions[0].transaction_status).toBe('Cleared')
  
      await waitForCardUpdate('card-1', 200)
      expect(cards.length).toBe(1);
      expect(cards[0].id).toBe('card-1');
    });
  
    it('should process Auth and Clearing Transactions for a pre-existing card', async () => {
      const authTransactionDTO: TransactionDTO = {
        id: 'transaction-id-1',
        transactionOriginId: 'card-1',
        transactionProcessor: "A",
        transactionType: "Authorization",
        network: 'VISA',
        merchantName: 'Test Merchant',
        transactionAmount: '100',
        transactionCurrency: 'AED',
        transactionTimestamp: new Date().toISOString(),
      };
      const clearingTransactionDTO: TransactionDTO = {
        id: 'transaction-id-1',
        transactionOriginId: 'card-1',
        transactionProcessor: "A",
        transactionType: "Clearing",
        network: 'VISA',
        merchantName: 'Test Merchant',
        transactionAmount: '100',
        transactionCurrency: 'AED',
        transactionTimestamp: new Date().toISOString(),
      };
  
      await Card.create({
        id: 'card-1',
        utilization: 0,
        limit: 2000000              
      })
  
      await controller.processTransaction(authTransactionDTO);
      await controller.processTransaction(clearingTransactionDTO);
      const transactions = await Transaction.findAll();
  
  
      const cards = await Card.findAll();
  
      expect(transactions.length).toBe(1);
      expect(transactions[0].id).toBe('transaction-id-1');
      expect(transactions[0].transaction_status).toBe('Cleared')
  
      await waitForCardUpdate('card-1', 200)
      expect(cards.length).toBe(1);
      expect(cards[0].id).toBe('card-1');
    });
    
    it('Should save only one auth transaction and ignore the second', async () => {
      const authTransactionDTO: TransactionDTO = {
        id: 'transaction-id-1',
        transactionOriginId: 'card-1',
        transactionProcessor: "A",
        transactionType: "Authorization",
        network: 'VISA',
        merchantName: 'Test Merchant',
        transactionAmount: '100',
        transactionCurrency: 'AED',
        transactionTimestamp: new Date().toISOString(),
      };
      const authTransactionDTO2: TransactionDTO = {
        id: 'transaction-id-1',
        transactionOriginId: 'card-1',
        transactionProcessor: "A",
        transactionType: "Authorization",
        network: 'VISA',
        merchantName: 'Test Merchant',
        transactionAmount: '100',
        transactionCurrency: 'AED',
        transactionTimestamp: new Date().toISOString(),
      };
      await controller.processTransaction(authTransactionDTO);
      await controller.processTransaction(authTransactionDTO2);
      const transactions = await Transaction.findAll();
      const cards = await Card.findAll();
  
      expect(transactions.length).toBe(1);
      expect(transactions[0].id).toBe('transaction-id-1');
      expect(transactions[0].transaction_status).toBe('Authorized')
  
      expect(cards.length).toBe(1);
      expect(cards[0].id).toBe('card-1');
      expect(cards[0].total_spent).toBe(100);
  
    });
  
    it('Should not save a clearing transaction without an auth transaction', async () => {
      const clearTransactionDTO: TransactionDTO = {
        id: 'transaction-id-1',
        transactionOriginId: 'card-1',
        transactionProcessor: "A",
        transactionType: "Clearing",
        network: 'VISA',
        merchantName: 'Test Merchant',
        transactionAmount: '100',
        transactionCurrency: 'AED',
        transactionTimestamp: new Date().toISOString(),
      };
  
      await controller.processTransaction(clearTransactionDTO);
  
      const transactions = await Transaction.findAll();
      const cards = await Card.findAll();
  
      expect(transactions.length).toBe(0);
      expect(cards.length).toBe(0);
    });

  })
  

  describe('PaymentProcessorController.processTransaction', () => {
    it('Should return transactions', async () => {

      await Card.create({
        id: 'card-1',
        utilization: 0,
        limit: 2000000              
      })
  
      await Transaction.bulkCreate([
          {
              id: 'transaction-id-1',
              transaction_status: TransactionStatus.AUTHORIZED,
              transaction_origin_id: 'card-1',
              network: "MASTERCARD",
              merchant_name: "Test-Merchant",
              authorization_transaction_amount: 1000,
              transaction_currency: "AED",
              authorization_timestamp: new Date(),
          }, 
          {
            id: 'transaction-id-2',
            transaction_status: TransactionStatus.CLEARED,
            transaction_origin_id: 'card-1',
            network: "MASTERCARD",
            merchant_name: "Test-Merchant",
            authorization_transaction_amount: 1000,
            clearing_transaction_amount: 1000,
            transaction_currency: "AED",
            clearing_timestamp: new Date(),
            authorization_timestamp: new Date(),
        }, 
      ]
      )
  
      const transactions = await controller.getTransactions();
      expect(transactions.Transactions.length).toBe(2);
    });
  })
});
