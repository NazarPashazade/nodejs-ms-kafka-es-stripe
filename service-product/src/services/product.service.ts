import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";
import type { Product } from "../models/product.model";
import type { ProductRepository } from "../repositories/product.repository";
import { BrokerOrderMessageType } from "../types/message.type";
import { AppEventListener } from "../utils/elastic-search/elastic-search-listener";
import { NotFoundError } from "../utils/error";
import { ElasticSearchService } from "./elastic-search.service";

export class ProductService {
  private _productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this._productRepository = productRepository;
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const product = await this._productRepository.create(data);
    if (!product.id) throw new Error("unable to create product");

    AppEventListener.instance.notify({
      event: "createProduct",
      data: product,
    });
    return product;
  }

  async updateProduct(id: number, product: UpdateProductRequest): Promise<any> {
    const updatedProduct = await this._productRepository.update(id, product);

    AppEventListener.instance.notify({
      event: "updateProduct",
      data: updatedProduct,
    });

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<number> {
    const deletedId = await this._productRepository.delete(id);

    AppEventListener.instance.notify({
      event: "deleteProduct",
      data: { id: deletedId },
    });

    return deletedId;
  }

  async getProducts(limit: number, offset: number, search: string) {
    const esService = new ElasticSearchService();
    return await esService.searchProduct(search);
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
