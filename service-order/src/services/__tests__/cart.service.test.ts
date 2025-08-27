import { CartRepository as repository } from "../../repositories/cart.repository";
import { Cart, CartRepositoryType } from "../../types/repository.type";
import { CartService as service } from "../cart.service";

describe("Cart Service Tests", () => {
  let repo: CartRepositoryType;

  beforeEach(() => {
    repo = repository;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  it("should add an item to the cart", async () => {
    const mockCart: Cart = {};

    jest.spyOn(repo, "create").mockResolvedValue(mockCart as any);

    const res = await service.createCartItem(mockCart, repository);

    expect(res).toEqual(expect.objectContaining(mockCart));
  });

  it("should remove an item from the cart", async () => {
    const mockCartId = 1;

    jest.spyOn(repo, "delete").mockResolvedValue(mockCartId);

    const res = await service.deleteCartItem(mockCartId, repository);

    expect(res).toBe(mockCartId);
  });
});
