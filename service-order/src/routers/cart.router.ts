import * as express from "express";
import {
  CreateCartRequestInput,
  CreateCartRequestSchema,
} from "../dto/cart-request.dto";
import { CartRepository as cartRepo } from "../repositories/cart.repository";
import { CartService as service } from "../services/cart.service";
import { ValidateRequest } from "../utils/validator";
import { RequestAuthorizer } from "../middleware/auth.middleware";

export const cartRouter = express.Router();

cartRouter.post("/", RequestAuthorizer, async (req, res, next) => {
  try {
    const user = req.user!;

    const err = ValidateRequest<CreateCartRequestInput>(
      req.body,
      CreateCartRequestSchema
    );

    const result = await service.addNewItemToCart(req.body, user.id, cartRepo);

    if (err) return res.status(404).json({ err });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

cartRouter.get("/", RequestAuthorizer, async (req, res, next) => {
  try {
    const user = req.user!;

    const result = await service.findCartWithItems(user.id, cartRepo);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

cartRouter.patch("/:itemId", RequestAuthorizer, async (req, res) => {
  try {
    const user = req.user!;

    const itemId = Number(req.params.itemId || "0");

    const result = await service.updateCartItem(
      user.id,
      {
        id: itemId,
        qty: req.body.qty,
      },
      cartRepo
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

cartRouter.delete("/:itemId", RequestAuthorizer, async (req, res) => {
  try {
    const user = req.user!;

    const itemId = Number(req.params.itemId || "0");

    const result = await service.deleteCartItem(user.id, itemId, cartRepo);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});
