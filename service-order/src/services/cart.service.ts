import { CartItem } from "../db/schema";
import {
  CreateCartRequestInput,
  EditCartRequestInput,
} from "../dto/cart-request.dto";
import { CartRepositoryType } from "../types/repository.type";
import { AuthorizeError, NotFoundError } from "../utils";
import { getProductDetails, getStockDetails } from "../utils/broker/api";

async function verifyCartOwnership(
  customerId: number,
  itemId: number,
  repo: CartRepositoryType
) {
  const cart = await repo.findCart(customerId);

  if (!cart) throw new NotFoundError("Cart not found!");

  const item = cart.items.find((item) => item.id === itemId);

  if (!item) {
    throw new AuthorizeError(
      "Not Found: You are not authorized to edit this cart!"
    );
  }
}

async function addNewItemToCart(
  { qty, productId }: CreateCartRequestInput,
  customerId: number,
  repo: CartRepositoryType
) {
  const { id, price, name, variant, stock } = await getProductDetails(
    productId
  );

  if (stock < qty) {
    throw new NotFoundError("Product is out of stock");
  }

  const existingCartItem = await repo.findCartItemByProductId(
    customerId,
    productId
  );

  // update quantity if product is already in cart
  if (existingCartItem) {
    return repo.updateCartItem(existingCartItem.id, existingCartItem.qty + qty);
  }

  const cartItem: CartItem = {
    productId: id,
    price: price.toString(),
    itemName: name,
    variant,
    qty,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 0,
    cartId: 0,
  };

  const cart = await repo.findCart(customerId);

  if (!cart) {
    const newCart = await repo.createCart(customerId);
    return await repo.addCartItem(customerId, newCart.id, cartItem);
  }

  return await repo.addCartItem(customerId, cart.id, cartItem);
}

async function findCartWithItems(customerId: number, repo: CartRepositoryType) {
  const cart = await repo.findCart(customerId);

  if (!cart) throw new NotFoundError("Cart not found!");

  if (!cart.items.length) throw new NotFoundError("Cart is empty!");

  const productIds = cart.items.map((item) => item.productId);

  const stockDetails = await getStockDetails(productIds);

  cart.items.forEach((item) => {
    const stock = stockDetails.find((stock) => stock.id === item.productId);
    if (stock) item.availability = stock.stock;
  });

  return cart;
}

async function updateCartItem(
  customerId: number,
  input: EditCartRequestInput,
  repo: CartRepositoryType
) {
  await verifyCartOwnership(customerId, input.id, repo);
  return await repo.updateCartItem(input.id, input.qty);
}

async function deleteCartItem(
  customerId: number,
  id: number,
  repo: CartRepositoryType
) {
  await verifyCartOwnership(customerId, id, repo);
  return await repo.deleteCartItem(id);
}

export const CartService = {
  addNewItemToCart,
  findCartWithItems,
  updateCartItem,
  deleteCartItem,
  verifyCartOwnership,
};
