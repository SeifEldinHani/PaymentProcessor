import {
    IsString,
    IsNumber,
    IsOptional,
    ValidateNested,
    IsEnum,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class DetailsDto {
    @IsString()
    oif: string;
  
    @IsString()
    token: string;
  
    @IsString()
    network: string;
  
    @IsString()
    oif_vat: string;
  
    @Type(() => Number)
    @IsNumber()
    vat_rate: number;
  
    @IsString()
    scheme_mcc: string;
  
    @Type(() => Number)
    @IsNumber()
    tx_fx_rate: number;
  
    @IsString()
    paymentology_pid: string;
  
    @IsString()
    paymentology_tid: string;
  
    @Type(() => Number)
    @IsNumber()
    principal_amount: number;
  
    @Type(() => Number)
    @IsNumber()
    scheme_tx_amount: number;
  
    @IsString()
    scheme_acceptor_id: string;
  
    @IsString()
    scheme_terminal_id: string;
  
    @IsString()
    scheme_tx_currency: string;
  
    @IsString()
    fast_message_log_id: string;
  
    @IsString()
    scheme_acceptor_city: string;
  
    @IsString()
    scheme_acceptor_name: string;
  
    @IsString()
    scheme_tx_local_time: string;
  
    @IsString()
    paymentology_auth_rid: string;
  
    @Type(() => Number)
    @IsNumber()
    scheme_billing_amount: number;
  
    @Type(() => Number)
    @IsNumber()
    scheme_billing_fx_rate: number;
  
    @IsString()
    scheme_acceptor_country: string;
  
    @IsString()
    scheme_billing_currency: string;
  
    @Type(() => Number)
    @IsNumber()
    scheme_settlement_amount: number;
  
    @IsString()
    scheme_transmission_time: string;
  
    @Type(() => Number)
    @IsNumber()
    scheme_settlement_fx_rate: number;
  
    @IsString()
    scheme_settlement_currency: string;
  
    @IsString()
    scheme_retrieval_reference_number: string;
  
    @IsString()
    scheme_systems_trace_audit_number: string;
  
    @IsOptional()
    @IsString()
    card_number?: string;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    interchange_fee_amount?: number;
  
    @IsOptional()
    @IsString()
    interchange_fee_currency?: string;
  
    @IsOptional()
    @IsString()
    scheme_reconciliation_date?: string;
  
    @IsOptional()
    @IsString()
    scheme_acceptor_terminal_street?: string;
  
    @IsOptional()
    @IsString()
    scheme_acceptor_terminal_postal_code?: string;
  
    @IsOptional()
    @IsString()
    interchange_fee_reconciliation_currency?: string;
  
    @IsOptional()
    @IsString()
    scheme_acceptor_terminal_city_or_state_code?: string;
  
    @IsOptional()
    @IsString()
    paymentology_additional_settlement_reference_rid?: string;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    interchange_fee_amount_in_reconciliation_currency?: number;
  }
  
  /**
   * Represents a transaction within an account transaction event.
   */
  class TransactionDto {
    @IsString()
    id: string;
  
    @IsString()
    type: string;
  
    @IsString()
    dr_cr: string;
  
    @Type(() => Number)
    @IsNumber()
    amount: number;
  
    @IsString()
    status: string;
  
    @ValidateNested()
    @Type(() => DetailsDto)
    details: DetailsDto;
  
    @IsString()
    reference: string;
  
    @IsString()
    account_id: string;
  
    @IsString()
    created_at: string;
  
    @IsString()
    release_date: string;
  
    @IsString()
    scheme_merchant_id: string;
  
    @IsOptional()
    @IsString()
    posted_at?: string;
  
    @IsOptional()
    @IsString()
    updated_at?: string;
  }
  

  enum AccountTransactionEventType {
    ACCOUNT_TRANSACTION_CREATED = 'ACCOUNT_TRANSACTION_CREATED',
    ACCOUNT_TRANSACTION_POSTED = 'ACCOUNT_TRANSACTION_POSTED',
  }
  
  export class PaymentProcessorBDTO {
    @IsString()
    id: string;
  
    @IsEnum(AccountTransactionEventType)
    type: AccountTransactionEventType;
  
    @IsOptional()
    @IsString()
    created_at?: string;
  
    @ValidateNested()
    @Type(() => TransactionDto)
    transaction: TransactionDto;
  }
  