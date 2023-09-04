import { ValueObject } from "./value_object";

export class StringValueObject extends ValueObject<string> {
  constructor(readonly value: any) {
    super(value);
  }

  static create(value: string): StringValueObject {
    return new StringValueObject(value);
  }
}
