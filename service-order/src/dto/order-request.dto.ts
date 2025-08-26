export type OrderItemType = {
  id: number;
  orderId?: number;
  productId: number;
  itemName: string;
  qty: number;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface OrderWithItems {
  id?: number;
  customerId: number;
  orderNumber: number;
  txnId: string;
  amount: string;
  status: string;
  items: OrderItemType[];
  createdAt?: Date;
  updatedAt?: Date;
}
