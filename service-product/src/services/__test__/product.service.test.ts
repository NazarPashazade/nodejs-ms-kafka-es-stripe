import { faker } from "@faker-js/faker";
import { Product } from "../../models/product.model";
import { ProductRepository } from "../../repositories/product.repository";
import { ProductFactory } from "../../utils/fixtures";
import { ProductService } from "../product.service";
import { IProductRepository } from "../../interfaces/product-repository.interface";

const mockProduct = (rest?: any): Product => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price()),
    stock: faker.number.int({ min: 1, max: 100 }),
    ...rest,
  };
};

describe("Product Service Tests", () => {
  let repository: IProductRepository;

  beforeEach(() => {
    repository = new ProductRepository();
  });

  afterEach(() => {
    repository = {} as ProductRepository;
  });

  describe("createProduct", () => {
    test("should create a product successfully", async () => {
      const service = new ProductService(repository);

      const data = mockProduct();

      const result = await service.createProduct(data);

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should throw error: unable to create product ", async () => {
      const service = new ProductService(repository);

      const data = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() => Promise.resolve({} as Product));

      const resultPromise = service.createProduct(data);

      (await expect(resultPromise)).rejects.toThrow("unable to create product");
    });

    test("should throw error: product already exist", async () => {
      const service = new ProductService(repository);

      const data = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("product already exist"))
        );

      const resultPromise = service.createProduct(data);

      (await expect(resultPromise)).rejects.toThrow("product already exist");
    });
  });

  describe("updateProduct", () => {
    test("should update Product successfully", async () => {
      const service = new ProductService(repository);

      const reqBody = mockProduct({
        id: faker.number.int({ min: 1, max: 100 }),
      });

      const result = await service.updateProduct(reqBody?.id!, reqBody);

      expect(result).toMatchObject(reqBody);
    });

    test("should throw error: Product doesn't exist", async () => {
      const service = new ProductService(repository);

      jest
        .spyOn(repository, "update")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product doesn't exist"))
        );

      const resultPromise = service.updateProduct(1, {});

      (await expect(resultPromise)).rejects.toThrow("Product doesn't exist");
    });
  });

  describe("getProducts", () => {
    test("should get products by offset and limit", async () => {
      const service = new ProductService(repository);

      const randomLimit = faker.number.int({ min: 1, max: 10 });
      const mockProducts = ProductFactory.buildList(randomLimit);

      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() => Promise.resolve(mockProducts));

      const result = await service.getProducts(randomLimit, 0);

      expect(result.length).toBe(randomLimit);
      expect(result).toMatchObject(mockProducts);
    });
  });

  describe("getProduct", () => {
    test("should get product by Id", async () => {
      const service = new ProductService(repository);

      const mockProduct = ProductFactory.buildList(1)[0]!;

      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() => Promise.resolve(mockProduct));

      const result = await service.getProduct(mockProduct?.id!);

      expect(result).toMatchObject(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    test("should delete product by id", async () => {
      const service = new ProductService(repository);

      const mockId = faker.number.int({ min: 1, max: 100 });

      jest
        .spyOn(repository, "delete")
        .mockImplementationOnce(() => Promise.resolve(mockId));

      const result = await service.deleteProduct(mockId);

      expect(result).toBe(mockId);
    });
  });
});
