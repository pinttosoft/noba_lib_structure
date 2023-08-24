import { StringValueObject } from "@/shared/domain/value_object/string_value_object";

export class FilterField extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
