import { Consumer, Producer } from "kafkajs";
import { OrderEvent } from "../types";
import { messageBroker } from "../utils/broker/message-broker";
import { OrderService } from "./order.service";

const initializeBroker = async () => {
  const producer = await messageBroker.connectProducer<Producer>();

  producer.on("producer.connect", async () => {
    console.log("Order Service: Producer connected successfully");
  });

  const consumer = await messageBroker.connectConsumer<Consumer>();

  consumer.on("consumer.connect", async () => {
    console.log("Order Service: Consumer connected successfully");
  });

  await messageBroker.subscribe(OrderService.handleSubscription, "OrderEvents");
};

const sendCreateOrderMessage = async (message: any) => {
  await messageBroker.publish({
    message,
    headers: {},
    topic: "ProductEvents",
    event: OrderEvent.CREATE_ORDER,
  });
};

const sendOrderCancelledMessage = async (message: any) => {
  await messageBroker.publish({
    message,
    headers: {},
    topic: "ProductEvents",
    event: OrderEvent.CANCEL_ORDER,
  });
};

export const brokerService = {
  initializeBroker,
  sendCreateOrderMessage,
  sendOrderCancelledMessage,
};
