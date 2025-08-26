import { faker } from "@faker-js/faker";
import { Factory } from "rosie";
import { Product } from "../../models/product.model";

export const ProductFactory = new Factory<Product>()
  .attr("id", faker.number.int({ min: 1, max: 100 }))
  .attr("name", faker.commerce.productName())
  .attr("description", faker.commerce.productDescription())
  .attr("price", Number(faker.commerce.price()))
  .attr("stock", faker.number.int({ min: 1, max: 100 }));
