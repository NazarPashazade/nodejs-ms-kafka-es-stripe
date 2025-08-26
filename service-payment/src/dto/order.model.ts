enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export interface InProcessOrder {
  id?: number;
  customerId: number;
  orderNumber: number;
  amount: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
