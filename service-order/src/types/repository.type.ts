import { Cart, CartItem, Order } from "../db/schema";
import { CartWithItems } from "../dto/cart-request.dto";
import { OrderWithItems } from "../dto/order-request.dto";

export type CartRepositoryType = {
  findCart: (customerId: number) => Promise<CartWithItems | undefined>;
  findCartItemByProductId: (
    customerId: number,
    productId: number
  ) => Promise<CartItem | null>;
  createCart: (customerId: number) => Promise<Cart>;
  addCartItem: (
    customerId: number,
    cartId: number,
    cartItem: CartItem
  ) => Promise<number>;
  updateCartItem: (id: number, qty: number) => Promise<CartItem>;
  deleteCartItem: (id: number) => Promise<Boolean>;
  clearCartItems: (id: number) => Promise<Boolean>;
};

export type OrderRepositoryType = {
  createOrder: (order: OrderWithItems) => Promise<number>;
  findOrderById: (id: number) => Promise<OrderWithItems | undefined>;
  findOrderByNumber: (orderNumber: number) => Promise<Order | undefined>;
  findOrders: (customerId: number) => Promise<OrderWithItems[] | undefined>;
  updateOrderStatus: (
    id: number,
    status: string
  ) => Promise<OrderWithItems | undefined>;
  cancelOrder: (id: number) => Promise<boolean>;
};
