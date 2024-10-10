import { TransactionMapperA} from "./transaction_mapper_a.service";
import { TransactionMapperB} from "./transaction_mapper_b.service";
import { TransactionMapper } from "./transaction_mapper.interface";
import { PaymentProcessorADTO } from "../transaction_dtos/payment_processor_a.dto";
import { PaymentProcessorBDTO } from "../transaction_dtos/payment_processor_b.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class TransactionMapperFactory {

    private static schemaToMapperMap: Map<any,any> = new Map<any, any>([
        [PaymentProcessorADTO, TransactionMapperA],
        [PaymentProcessorBDTO, TransactionMapperB]
    ])

    static async createTransactionMapper(transaction: any): Promise<TransactionMapper> {
        for (const [paymentProcessorDTO, mapper] of this.schemaToMapperMap.entries()) {
          const dtoInstance = plainToClass(paymentProcessorDTO, transaction);
          
          const errors = await validate(dtoInstance);

          if (errors.length === 0) {
            return new mapper();
          }
        }
        throw new Error("Unrecognized Payment Processor Schema");
      }
}