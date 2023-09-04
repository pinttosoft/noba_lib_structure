import { ContactValidationType } from "./enums/contact_validation_type";
import randomString from "../../shared/helpers/randomString";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { StringValueObject } from "../../shared";
import { ExpiredCodeValidation } from "./exceptions/expired_code_validation";

export class ValidateUserContact extends AggregateRoot {
  private id?: string;
  private userId: string;
  private codeValidate: string;
  private typeValidation: ContactValidationType;
  private createdAt: Date;

  static generateCodeForValidation(
    userId: StringValueObject,
    type: ContactValidationType,
  ) {
    const v: ValidateUserContact = new ValidateUserContact();
    v.codeValidate = randomString(6);
    v.typeValidation = type;
    v.userId = userId.toString();
    v.createdAt = new Date();

    return v;
  }

  static fromPrimitives(id: string, data: any): ValidateUserContact {
    const v: ValidateUserContact = new ValidateUserContact();
    v.userId = data.userId;
    v.id = id;
    v.codeValidate = data.codeValidate;
    v.typeValidation = data.typeValidation;
    v.createdAt = data.createdAt;

    return v;
  }

  getId(): string {
    return this.id;
  }

  getCodeForValidation(): string {
    const now: Date = new Date();

    const differenceInMilliseconds: number =
      now.getTime() - this.createdAt.getTime();

    const limitInMilliseconds: number = 15 * 60 * 1000;

    if (differenceInMilliseconds >= limitInMilliseconds) {
      throw new ExpiredCodeValidation();
    }

    return this.codeValidate;
  }

  getTypeValidation(): ContactValidationType {
    return this.typeValidation;
  }

  toPrimitives(): any {
    return {
      code: this.codeValidate,
      type: this.typeValidation,
    };
  }
}
