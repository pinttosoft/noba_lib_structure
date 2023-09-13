import { AggregateRoot } from "./aggregate_root";

export class Cache extends AggregateRoot {
  private readonly id?: string;
  private readonly key: string;
  private value: any;

  constructor(id: string | null, key: string, value: any) {
    super();

    this.value = value;
    this.id = id;
    this.key = key;
  }

  getId() {
    return this.id;
  }

  static fromPrimitives(id: string | null, key: string, value: any): Cache {
    return new Cache(id, key, value);
  }

  setUpdateValue(value: any) {
    this.value = value;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      key: this.key,
      value: this.value,
    };
  }
}
