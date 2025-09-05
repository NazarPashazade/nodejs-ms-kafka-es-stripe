import * as express from "express";
import { ProductRepository } from "../repositories/product.repository";
import { RequestValidator } from "../utils/request-validator";
import { CreateProductRequest } from "../dto/product.dto";
import { BrokerService } from "../services/broker.service";
import { ProductService } from "../services/product.service";

export const productRouter = express.Router();

export const productService = new ProductService(new ProductRepository());

export const brokerService = new BrokerService(productService);

// brokerService.initializeBroker();

productRouter.post("/", async (req, res) => {
  try {
    const { errors, input } = await RequestValidator(
      CreateProductRequest,
      req.body
    );

    if (errors) return res.status(400).json(errors);

    const result = await productService.createProduct(input);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

productRouter.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id || "0");

    const result = await productService.updateProduct(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

productRouter.get("/", async (req, res) => {
  try {
    const limit = Number(req.query["limit"] || "10");
    const offset = Number(req.query["offset"] || "0");
    const search = req.query["search"] as string;

    const result = await productService.getProducts(limit, offset, search);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

productRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id || "0");

    const result = await productService.getProduct(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id || "0");

    const result = await productService.deleteProduct(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

productRouter.post("/stock", async (req, res) => {
  try {
    const result = await productService.getStockDetails(req.body.ids);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});
