import { CreateProductRequest } from "./product.dto";

export type ProductRequest = { id: number } & CreateProductRequest;
