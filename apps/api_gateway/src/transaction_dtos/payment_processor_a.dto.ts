import {
    IsString,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsArray,
  } from 'class-validator';
  
  export class PaymentProcessorADTO {
    @IsString()
    id: string;
  
    @IsString()
    mcc: string;
  
    @IsString()
    rrn: string;
  
    @IsBoolean()
    moto: boolean;
  
    @IsString()
    stan: string;
  
    @IsString()
    card_id: string;
  
    @IsString()
    network: string;
  
    @IsString()
    user_id: string;
  
    @IsBoolean()
    fallback: boolean;
  
    @IsBoolean()
    recurring: boolean;
  
    @IsString()
    card_entry: string;
  
    @IsString()
    account_id1: string;
  
    @IsArray()
    fee_details: any[];
  
    @IsString()
    merchant_id: string;
  
    @IsBoolean()
    pin_present: boolean;
  
    @IsString()
    status_code: string;
  
    @IsString()
    terminal_id: string;
  
    @IsString()
    is_cancelled: string;
  
    @IsString()
    message_type: string;
  
    @IsString()
    merchant_city: string;
  
    @IsString()
    merchant_name: string;
  
    @IsNumber()
    billing_amount: number;
  
    @IsNumber()
    clearing_count: number;
  
    @IsNumber()
    reversal_count: number;
  
    @IsBoolean()
    is_cash_advance: boolean;
  
    @IsString()
    pos_environment: string;
  
    @IsString()
    auth_id_response: string;
  
    @IsString()
    billing_currency: string;
  
    @IsString()
    card_expiry_date: string;
  
    @IsString()
    merchant_country: string;
  
    @IsString()
    transaction_type: string;
  
    @IsString()
    card_last4_digits: string;
  
    @IsString()
    card_first6_digits: string;
  
    @IsString()
    status_description: string;
  
    @IsNumber()
    transaction_amount: number;
  
    @IsString()
    transaction_currency: string;
  
    @IsString()
    transaction_timestamp: string;
  
    @IsNumber()
    billing_amount_account: number;
  
    @IsString()
    network_transaction_id: string;
  
    @IsString()
    transmission_date_time: string;
  
    @IsString()
    conversion_rate_billing: string;
  
    @IsBoolean()
    incremental_transaction: boolean;
  
    @IsBoolean()
    installment_transaction: boolean;
  
    @IsString()
    transaction_description: string;
  
    @IsString()
    billing_currency_account: string;
  
    @IsNumber()
    conversion_rate_billing_account: number;
  
    @IsOptional()
    @IsString()
    acquirer_id?: string;
  
    @IsOptional()
    @IsString()
    date_time_acquirer?: string;
  
    @IsOptional()
    @IsString()
    eci?: string;
  
    @IsOptional()
    @IsNumber()
    fee_amount?: number;
  
    @IsOptional()
    @IsString()
    clearing_id?: string;
  
    @IsOptional()
    @IsString()
    settlement_status?: string;
  
    @IsOptional()
    @IsString()
    parent_transaction_id?: string;
  }
  