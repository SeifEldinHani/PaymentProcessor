import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as grpc from '@grpc/grpc-js';
import { promisify } from 'util'; 
import { join } from 'path';
import { PaymentProcessorModule } from '../src/payment_processor.module';
const { Transaction } = require("/models");

const Sequelize = require('sequelize');
const protoLoader = require('@grpc/proto-loader');

describe('PaymentProcessorController (gRPC) E2E', () => {
  let client: any;
  let sequelize: any; 
  let app:any; 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PaymentProcessorModule], // Import your main application module
    }).compile();

    let app = moduleFixture.createNestApplication();
    await app.init();
    let sequelize = new Sequelize({
      dialect: 'postgres',
      username: 'test_user',
      password: 'test_password',
      database: 'myapp_test',
      models: [join('/models')], 
    });

    await sequelize.sync({ force: true });

    const protoPath = '/proto/payment_processor.proto';
    const packageDefinition = protoLoader.loadSync(protoPath);

    const grpcObject = grpc.loadPackageDefinition(packageDefinition);
    const paymentProcessorProto = grpcObject['payment_processor'] as grpc.GrpcObject;
    client = new (paymentProcessorProto['PaymentProcessorService'] as grpc.ServiceClientConstructor)(
      'localhost:5000',
      grpc.credentials.createInsecure(),
    );
    
  });

  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  it('should process a transaction via gRPC', async () => {
    const transactionDTO = {
      id: 'transaction-id-1',
      transaction_origin_id: 'origin-1',
      network: 'VISA',
      merchant_name: 'Test Merchant',
      authorization_transaction_amount: 100,
      transaction_currency: 'USD',
      authorization_timestamp: new Date().toISOString(),
    };

    const result = await client.ProcessTransaction(transactionDTO);

  
    expect(result).toBeDefined(); 
    const transactions = await Transaction.findAll();
    expect(transactions.length).toBe(1);
    expect(transactions[0].id).toBe('transaction-id-1');
  });
});
