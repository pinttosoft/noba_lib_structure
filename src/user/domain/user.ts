import { AggregateRoot } from "../../shared/domain/aggregate_root";
import randomString from "../../shared/helpers/randomString";
import { PasswordValueObject } from "./value_objects/password_value_object";
import { v4 } from "uuid";

export class User extends AggregateRoot {
  private id?: string;
  private userId: string;
  private email: string;
  private password: PasswordValueObject;
  private country: string;
  private token?: string;
  private clientId: string = null;
  private createdAt?: Date;
  private active: boolean;
  private referredByClientId?: string;

  static createNewUser(
    email: string,
    password: PasswordValueObject,
    country: string,
  ): User {
    const u: User = new User();
    u.email = email;
    u.password = password;
    u.country = country;
    u.createdAt = new Date();
    u.active = false;
    u.clientId = null;
    u.userId = v4();

    return u;
  }

  static fromPrimitives(id: string, data: any): User {
    const u: User = new User();
    u.id = id;
    u.email = data.email;
    u.createdAt = data.createdAt;
    u.active = data.active;
    u.country = data.country;

    u.clientId = data.clientId ?? null;
    u.token = data.token ?? null;
    u.password = PasswordValueObject.fromPrimitive(data.password) ?? null;
    u.userId = data.userId;
    u.referredByClientId = data.referredByClientId ?? null;

    return u;
  }

  activateUser(): User {
    this.active = true;
    return this;
  }

  getId(): string | null {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getPassword(): string {
    return this.password.getValue();
  }

  getToken(): string {
    return this.token;
  }

  getEmail(): string {
    return this.email;
  }

  createToken(): User {
    this.token = randomString(140);

    return this;
  }

  setUpdatePassword(newPass: PasswordValueObject): User {
    this.password = newPass;
    return this;
  }

  setReferredByClientId(referredByClientId: string): User {
    this.referredByClientId = referredByClientId;
    return this;
  }

  isActive(): boolean {
    return this.active;
  }

  setClientId(clientId: string): void {
    this.clientId = clientId;
  }

  getClientId(): string {
    return this.clientId;
  }

  getReferredByClientId(): string {
    return this.referredByClientId;
  }

  async toPrimitives(): Promise<any> {
    return {
      email: this.email,
      password: await this.password.getValueEncrypt(),
      country: this.country,
      token: this.token,
      clientId: this.clientId,
      createdAt: this.createdAt,
      active: this.active,
      userId: this.userId,
      referredByClientId: this.referredByClientId,
    };
  }
}
