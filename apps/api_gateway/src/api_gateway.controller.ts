import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiGatewayService } from './api_gateway.service';

@Controller('api')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get('/transactions')
  getTransactions(){
    return this.apiGatewayService.getTransactions();
  }


  @Post('/webhook')
  async transactionsWebHook(@Body()  transaction){
    this.apiGatewayService.postTransaction(transaction)
    return {message: "Transaction Received"}
  }
}
