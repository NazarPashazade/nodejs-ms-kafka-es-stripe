import { Static, Type } from "@sinclair/typebox";

export const CreateCartRequestSchema = Type.Object({
  productId: Type.Integer(),
  qty: Type.Integer(),
});

export type CreateCartRequestInput = Static<typeof CreateCartRequestSchema>;

export const EditCartRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type EditCartRequestInput = Static<typeof EditCartRequestSchema>;

type CartItem = {
  id: number;
  productId: number;
  cartId: number;
  itemName: string;
  variant: string | null;
  qty: number;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  availability?: number;
};

export interface CartWithItems {
  id: number;
  customerId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
