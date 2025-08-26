import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { BROKERS, CLIENT_ID, GROUP_ID } from "../../config";
import { MessageType, PaymentEvent, TOPIC_TYPE } from "../../types";
import { MessageBrokerType, MessageHandler, PublishType } from "./broker.type";

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});

let producer: Producer;
let consumer: Consumer;

const createTopics = async (topics: string[]) => {
  const newTopics = topics.map((t) => ({
    topic: t,
    numPartitions: 2,
    replicationFactor: 2,
  }));

  const admin = kafka.admin();

  await admin.connect();

  const existingTopics = await admin.listTopics();

  for (const t of newTopics) {
    if (existingTopics.includes(t.topic)) {
      await admin.createTopics({ topics: [t] });
    }
  }

  await admin.disconnect();
};

const connectProducer = async <T>(): Promise<T> => {
  await createTopics(["OrderEvents"]);

  if (!producer) {
    producer = await kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    await producer.connect();
    console.log("New Producer was created...");
  }

  return producer as T;
};

const disconnectProducer = async (): Promise<void> => {
  if (producer) await producer.disconnect();
};

const publish = async (data: PublishType): Promise<boolean> => {
  const { event, headers, message, topic } = data;

  const producer = await connectProducer<Producer>();

  // will create new topic if not exist
  const result = await producer.send({
    topic,
    messages: [
      {
        headers,
        key: event,
        value: JSON.stringify(message),
      },
    ],
  });

  console.log(`Published Result: `, result);

  return !!result;
};

const connectConsumer = async <T>(): Promise<T> => {
  if (!consumer) {
    consumer = kafka.consumer({ groupId: GROUP_ID });
    await consumer.connect();
    console.log("New Consumer was created...");
  }

  return consumer as T;
};

const disconnectConsumer = async (): Promise<void> => {
  if (consumer) await consumer.disconnect();
};

const subscribe = async (
  messageHandler: MessageHandler,
  topic: TOPIC_TYPE
): Promise<void> => {
  const consumer = await connectConsumer<Consumer>();

  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async (msg) => {
      const { key, value, headers, offset } = msg.message;

      const events = ["OrderEvents"];

      if (!events.includes(topic)) return;

      if (key && value) {
        const inputMessage: MessageType = {
          event: key.toString() as PaymentEvent,
          headers: headers ?? {},
          data: JSON.parse(value.toString()),
        };

        await messageHandler(inputMessage);

        await consumer.commitOffsets([
          {
            topic,
            partition: msg.partition,
            offset: String(Number(offset) + 1),
          },
        ]);
      }
    },
  });
};

export const messageBroker: MessageBrokerType = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe,
};
