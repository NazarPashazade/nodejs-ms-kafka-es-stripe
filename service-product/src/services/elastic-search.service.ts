import { Client } from "@elastic/elasticsearch";
import { ELASTIC_SEARCH_URL } from "../config";
import { ProductRequest } from "../dto/product-es.dto";
import { EventPayload } from "../utils/elastic-search/elastic-search-listener";

export class ElasticSearchService {
  private _indexName = "product";
  private _client: Client;

  constructor() {
    this._client = new Client({ node: ELASTIC_SEARCH_URL });
  }

  async createIndex() {
    const existingIndex = await this._client.indices.exists({
      index: this._indexName,
    });

    if (!existingIndex) {
      await this._client.indices.create({
        index: this._indexName,
        body: {
          mappings: {
            properties: {
              id: { type: "keyword" },
              title: { type: "text" },
              description: { type: "text" },
              price: { type: "float" },
              stock: { type: "integer" },
            },
          },
        } as Record<string, any>,
      });
    }
  }

  async getProduct(id: number) {
    const result = await this._client.get({
      index: this._indexName,
      id: id.toString(),
    });

    return result._source;
  }

  async createProduct(data: ProductRequest) {
    const result = await this._client.index({
      index: this._indexName,
      id: data.id.toString(),
      document: data,
    });

    return result;
  }

  async updateProduct(data: ProductRequest) {
    const result = await this._client.update({
      index: this._indexName,
      id: data.id.toString(),
      doc: data,
    });

    return result;
  }

  async deleteProduct(id: number) {
    const result = await this._client.delete({
      index: this._indexName,
      id: id.toString(),
    });

    return result;
  }

  async searchProduct(queryString: string) {
    const query = queryString.length
      ? {
          multi_match: {
            query: queryString,
            fuzziness: "AUTO", // works even with TYPO
            fields: ["title", "description"],
          },
        }
      : {
          match_all: {},
        };

    const result = await this._client.search({
      index: this._indexName,
      query,
    });

    return result.hits.hits.map((hit) => hit._source);
  }

  async handleEvents({ event, data }: EventPayload) {
    console.log(`ElasticSearch - handleEvents: ${event} received: `, data);

    switch (event) {
      case "createProduct":
        return await this.createProduct(data as ProductRequest);
      case "updateProduct":
        return await this.updateProduct(data as ProductRequest);
      case "deleteProduct":
        return await this.deleteProduct((data as ProductRequest).id);
    }
  }
}
