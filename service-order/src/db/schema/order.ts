import { InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: integer("order_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  amount: numeric("amount").notNull(),
  status: varchar("status").$default(() => "PENDING"),
  txnId: varchar("txn_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = InferSelectModel<typeof orders>;

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name").notNull(),
  qty: integer("qty").notNull(),
  amount: numeric("amount").notNull(),
  productId: integer("product_id").notNull(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type OrderItem = InferSelectModel<typeof orderItems>;

export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const OrderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
