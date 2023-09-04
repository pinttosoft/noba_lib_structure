import {Value_object} from "./value_object";

export abstract class StringValueObject extends Value_object<string> {
  constructor(readonly value: any) {
    super(value);
  }

  static create(value: string): StringValueObject {
    return new ConcreteStringValueObject(value);
  }
}

class ConcreteStringValueObject extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
