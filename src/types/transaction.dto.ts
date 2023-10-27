export enum TransactionStatusEnum {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

export interface TransactionDto {
  amount: string;
  currency: string;
  network: string;
  decimalAmount: string;
  networkAmount: string;
  fiatCurrency: string;
  status: TransactionStatusEnum;
  createdAt: Date;
  user: {
    email: string;
  };
}
