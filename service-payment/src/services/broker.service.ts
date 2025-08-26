import { Producer } from "kafkajs";
import { messageBroker } from "../utils/broker/message-broker";
import { PaymentEvent } from "../types";

// Payment service only publishes messages to the broker
// It does not consume messages, so no need for a consumer setup here
const initializeBroker = async () => {
  const producer = await messageBroker.connectProducer<Producer>();

  producer.on("producer.connect", async () => {
    console.log("Order Service: Producer connected successfully");
  });

  await messageBroker.subscribe(
    (message: any) => console.log({ message }),
    "OrderEvents"
  );
};

const sendPaymentUpdateMessage = async (message: any) => {
  await messageBroker.publish({
    message,
    headers: {},
    topic: "OrderEvents",
    event: PaymentEvent.UPDATE_PAYMENT,
  });
};

export const brokerService = {
  initializeBroker,
  sendPaymentUpdateMessage,
};
