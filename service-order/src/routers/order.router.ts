import * as express from "express";
import { RequestAuthorizer } from "../middleware/auth.middleware";
import { CartRepository as cartRepo } from "../repositories/cart.repository";
import { OrderRepository as orderRepo } from "../repositories/order.repository";
import { OrderService as orderService } from "../services/order.service";
import { OrderStatus } from "../types";

export const orderRouter = express.Router();

orderRouter.post("/", RequestAuthorizer, async (req, res) => {
  try {
    const user = req.user!;

    const result = await orderService.createOrder(user.id, orderRepo, cartRepo);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

orderRouter.get("/", RequestAuthorizer, async (req, res) => {
  try {
    const user = req.user!;

    const result = await orderService.getOrders(user.id!, orderRepo);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

orderRouter.get("/:id", RequestAuthorizer, async (req, res) => {
  try {
    const user = req.user!;

    const id = Number(req.params.id || "0");

    const result = await orderService.getOrderById(id, orderRepo);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

// It will be called only by microservice
orderRouter.get(
  "/:orderNumber/checkout",
  RequestAuthorizer,
  async (req, res) => {
    try {
      const user = req.user!;

      const orderNumber = Number(req.params.orderNumber || "0");

      const result = await orderService.getOrderByNumber(
        orderNumber,
        orderRepo
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json((error as Error).message || "Internal Server Error");
    }
  }
);

// It will be called only by microservice
orderRouter.patch("/:id", RequestAuthorizer, async (req, res) => {
  try {
    const id = Number(req.params.id || "0");
    const status = req.body.status as OrderStatus;
    const result = await orderService.updateOrderStatus(id, status, orderRepo);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

orderRouter.delete("/:id", RequestAuthorizer, async (req, res) => {
  try {
    const user = req.user!;

    const id = Number(req.params.id || "0");

    const result = await orderService.deleteOrder(id, orderRepo);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});
