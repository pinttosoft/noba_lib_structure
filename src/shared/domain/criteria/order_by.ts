import { StringValueObject } from "@/shared/domain/value_object/string_value_object";

export class OrderBy extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
