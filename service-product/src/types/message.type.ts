type OrderItemType = {
  id: number;
  productId: number;
  qty: number;
};

export interface BrokerOrderMessageType {
  id: number;
  items: OrderItemType[];
  orderNumber: string;
}
