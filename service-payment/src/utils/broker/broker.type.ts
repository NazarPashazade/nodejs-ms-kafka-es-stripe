import { MessageType, PaymentEvent, TOPIC_TYPE } from "../../types";

export interface PublishType {
  headers: Record<string, any>;
  message: Record<string, any>;
  topic: TOPIC_TYPE;
  event: PaymentEvent;
}

export type MessageHandler = (input: MessageType) => void;

export type MessageBrokerType = {
  //producer
  connectProducer: <T>() => Promise<T>;
  disconnectProducer: () => Promise<void>;
  publish: (data: PublishType) => Promise<boolean>;

  //producer
  connectConsumer: <T>() => Promise<T>;
  disconnectConsumer: () => Promise<void>;
  subscribe: (
    messageHandler: MessageHandler,
    topic: TOPIC_TYPE
  ) => Promise<void>;
};
