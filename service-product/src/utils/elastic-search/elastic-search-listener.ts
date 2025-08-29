import { EventEmitter } from "stream";
import { ElasticSearchService } from "../../services/elastic-search.service";

export interface EventPayload {
  event: "createProduct" | "updateProduct" | "deleteProduct";
  data: unknown;
}

export class AppEventListener extends EventEmitter {
  private static _instance: AppEventListener;

  private constructor() {
    super();
  }

  private eventName: string = "ELASTIC_SEARCH_EVENT";

  static get instance(): AppEventListener {
    return this._instance || (this._instance = new AppEventListener());
  }

  notify(payload: EventPayload) {
    this.emit(this.eventName, payload);
  }

  listen(service: ElasticSearchService) {
    this.on(this.eventName, (payload: EventPayload) => {
      service.handleEvents(payload);
    });
  }
}

export const initializeElasticSearch = () => {
  const service = new ElasticSearchService();
  AppEventListener.instance.listen(service);
};
