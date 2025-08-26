import { eq } from "drizzle-orm";
import { DB } from "../db/db-connection";
import { Order, orderItems, orders } from "../db/schema";
import { OrderWithItems } from "../dto/order-request.dto";
import { OrderRepositoryType } from "../types/repository.type";

const createOrder = async (order: OrderWithItems) => {
  const { amount, customerId, items, orderNumber, status, txnId } = order;

  const result = await DB.insert(orders)
    .values({
      customerId,
      amount,
      status,
      txnId,
      orderNumber,
    })
    .returning({ id: orders.id });

  const orderId = (result as any)[0].id;

  if (orderId) {
    for (const item of items) {
      const { amount, productId, itemName, qty } = item;

      await DB.insert(orderItems)
        .values({
          orderId,
          qty,
          amount: amount.toString(),
          itemName,
          productId,
        })
        .execute();
    }

    return orderId;
  }
};

export const findOrderByNumber = async (
  orderNumber: number
): Promise<Order | undefined> => {
  const order = await DB.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
  });

  return order;
};

export const findOrderById = async (
  id: number
): Promise<OrderWithItems | undefined> => {
  const order = await DB.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
    },
  });

  return order as OrderWithItems;
};

export const findOrders = async (
  customerId: number
): Promise<OrderWithItems[] | undefined> => {
  const ordersList = await DB.query.orders.findMany({
    where: eq(orders.customerId, customerId),
    with: {
      items: true,
    },
  });

  return ordersList as OrderWithItems[];
};

export const updateOrderStatus = async (
  id: number,
  status: string
): Promise<OrderWithItems | undefined> => {
  const order = await DB.update(orders)
    .set({ status })
    .where(eq(orders.id, id))
    .returning();

  return findOrderById(id);
};

export const cancelOrder = async (id: number): Promise<boolean> => {
  const result = await DB.delete(orders).where(eq(orders.id, id)).returning();
  return !!result;
};

export const OrderRepository: OrderRepositoryType = {
  createOrder,
  findOrderById,
  findOrderByNumber,
  findOrders,
  updateOrderStatus,
  cancelOrder,
};
