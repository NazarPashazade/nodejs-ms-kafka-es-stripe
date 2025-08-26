import type { Product } from "../models/product.model";

export interface IProductRepository {
  findOne(id: number): Promise<Product | null>;

  find(limit: number, offset: number): Promise<Product[]>;

  findStock(ids: number[]): Promise<Product[]>;

  create(product: Product): Promise<Product>;

  update(id: number, product: Product): Promise<Product>;

  delete(id: number): Promise<number>;
}
