import { Consumer, Producer } from "kafkajs";
import { productService } from "../routers/product.router";
import { ProductEvent } from "../types";
import { messageBroker } from "../utils/broker/message-broker";
import { ProductService } from "./product.service";

export class BrokerService {
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private _productService: ProductService;

  constructor(productService: ProductService) {
    this._productService = productService;
  }

  async initializeBroker() {
    this.producer = await messageBroker.connectProducer<Producer>();

    this.producer.on("producer.connect", () => {
      console.log("Product Service: Producer connected successfully");
    });

    this.consumer = await messageBroker.connectConsumer<Consumer>();

    this.consumer.on("consumer.connect", () => {
      console.log("Product Service: Consumer connected successfully");
    });

    // Subscribe
    await messageBroker.subscribe(
      productService.handleBrokerMessage,
      "ProductEvents"
    );
  }

  async sendCreateOrderMessage(message: any) {
    await messageBroker.publish({
      message,
      headers: {},
      topic: "ProductEvents",
      event: ProductEvent.CREATE_ORDER,
    });
  }

  async sendDeleteProductMessage(message: any) {
    await messageBroker.publish({
      message,
      headers: {},
      topic: "ProductEvents",
      event: ProductEvent.CANCEL_ORDER,
    });
  }
}
