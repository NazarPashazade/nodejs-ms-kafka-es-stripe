export enum OrderEvent {
  CREATE_ORDER = "create_order",
  CANCEL_ORDER = "cancel_order",
  UPDATE_PAYMENT = "update_payment",
}

export type TOPIC_TYPE = "OrderEvents" | "ProductEvents";

export interface MessageType {
  headers?: Record<string, any>;
  data: Record<string, any>;
  event: OrderEvent;
}
