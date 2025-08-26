export enum PaymentEvent {
  CREATE_PAYMENT = "create_payment",
  UPDATE_PAYMENT = "update_payment",
}

// Payment-service only publishes messages to Order-service
export type TOPIC_TYPE = "OrderEvents";

export interface MessageType {
  headers?: Record<string, any>;
  data: Record<string, any>;
  event: PaymentEvent;
}
