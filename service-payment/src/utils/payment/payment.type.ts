export type CreatePaymentResponse = {
  secret: string;
  pubKey: string;
  amount: number;
};

export type PaymentMetadata = { orderNumber: number; customerId: number };

export type PaymentGateway = {
  getPayment: (paymentId: string) => Promise<Record<string, unknown>>;
  createPayment: (
    amount: number,
    metaData: PaymentMetadata
  ) => Promise<CreatePaymentResponse>;
};
