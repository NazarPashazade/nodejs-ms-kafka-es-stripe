import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";
import type { Product } from "../models/product.model";
import type { ProductRepository } from "../repositories/product.repository";
import { BrokerOrderMessageType } from "../types/message.type";
import { NotFoundError } from "../utils/error";

export class ProductService {
  private _productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this._productRepository = productRepository;
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const product = await this._productRepository.create(data);
    if (!product.id) throw new Error("unable to create product");
    return product;
  }

  async updateProduct(id: number, product: UpdateProductRequest): Promise<any> {
    return this._productRepository.update(id, product);
  }

  async deleteProduct(id: number): Promise<number> {
    return this._productRepository.delete(id);
  }

  async getProducts(limit: number, offset: number): Promise<Product[]> {
    return this._productRepository.find(limit, offset);
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this._productRepository.findOne(id);

    if (!product) throw new NotFoundError(`Product with id ${id} not found`);

    return product;
  }

  async getStockDetails(ids: number[]): Promise<Product[]> {
    const products = await this._productRepository.findStock(ids);

    if (!products) throw new Error("Unable to find product stock details");

    return products;
  }

  /**
   * Handles the broker message for order creation and updates product stock accordingly.
   * @param message - The message containing order details.
   */
  handleBrokerMessage = async (message: any): Promise<void> => {
    const items = (message.data as BrokerOrderMessageType).items;

    console.log(items);

    for (const item of items) {
      console.log(
        `Order item: Product ID: ${item.productId}, Quantity: ${item.qty}`
      );

      const product = await this.getProduct(item.productId);

      console.log({ product });

      if (!product) {
        console.error(
          `Product with id ${item.productId} not found during stock update for create order event`
        );
      } else {
        const updatedStock = product.stock - item.qty;

        await this.updateProduct(item.productId, { stock: updatedStock });
      }

      //perform stock update
    }
  };
}
