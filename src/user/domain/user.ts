import { AggregateRoot } from "../../shared/domain/aggregate_root";
import randomString from "../../shared/helpers/randomString";
import { PasswordValueObject } from "./value_objects/password_value_object";
import { v4 } from "uuid";

export class User extends AggregateRoot {
  private id?: string;
  private userId: string;
  private email: string;
  private password: string;
  private country: string;
  private token?: string;
  private clientId?: string;
  private createdAt?: Date;
  private active: boolean;

  static createNewUser(
    email: string,
    password: string,
    country: string,
  ): User {
    const u: User = new User();
    u.email = email;
    u.password = password;
    u.country = country;
    u.createdAt = new Date();
    u.active = false;
    u.userId = v4();

    return u;
  }

  static fromPrimitives(id: string, data: any): User {
    const u = new User();
    u.id = id;
    u.email = data.email;
    u.createdAt = data.createdAt;
    u.active = data.active;
    u.country = data.country;

    u.clientId = data.clientId ?? null;
    u.token = data.token ?? null;
    u.password = data.password ?? null;
    u.userId = data.userId;

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
    return this.password;
  }

  getToken(): string {
    return this.token;
  }

  createToken(): User {
    this.token = randomString(140);

    return this;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      country: this.country,
      token: this.token,
      clientId: this.clientId,
      createdAt: this.clientId,
      active: this.active,
    };
  }
}
