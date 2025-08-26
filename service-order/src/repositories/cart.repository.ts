import { eq } from "drizzle-orm";
import { DB } from "../db/db-connection";
import { Cart, CartItem, cartItems, carts } from "../db/schema";
import { CartWithItems } from "../dto/cart-request.dto";
import { CartRepositoryType } from "../types/repository.type";

export const CartRepository: CartRepositoryType = {
  createCart: async function (customerId: number): Promise<Cart> {
    const [cart] = await DB.insert(carts).values({ customerId }).returning();
    return cart!;
  },

  addCartItem: async function (
    customerId: number,
    cartId: number,
    cartItem: CartItem
  ): Promise<number> {
    const { price, itemName, qty, variant, productId } = cartItem;

    await DB.insert(cartItems).values({
      cartId,
      productId,
      itemName,
      price,
      qty,
      variant,
    });

    return cartId;
  },

  findCart: async function (
    customerId: number
  ): Promise<CartWithItems | undefined> {
    return await DB.query.carts.findFirst({
      where: eq(carts.customerId, customerId),
      with: { items: true },
    });
  },

  updateCartItem: async function (id: number, qty: number): Promise<CartItem> {
    const [cartItem] = await DB.update(cartItems)
      .set({ qty })
      .where(eq(cartItems.id, id))
      .returning();

    return cartItem!;
  },

  deleteCartItem: async function (id: number): Promise<Boolean> {
    await DB.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return true;
  },

  clearCartItems: async function (id: number): Promise<Boolean> {
    const result = await DB.delete(carts)
      .where(eq(carts.customerId, id))
      .returning();
    return !!result;
  },

  findCartItemByProductId: async function (
    customerId: number,
    productId: number
  ): Promise<CartItem | null> {
    const cart = await DB.query.carts.findFirst({
      where: eq(carts.customerId, customerId),
      with: {
        items: {
          where: eq(cartItems.productId, productId),
        },
      },
    });

    if (!cart) return null;

    return cart.items[0]!;
  },
};
