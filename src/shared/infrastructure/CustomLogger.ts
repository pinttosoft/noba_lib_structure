import { v4 } from "uuid";

export class CustomLogger {
  private codeHash: string;

  constructor() {
    this.codeHash = process.env.requestId ?? v4();

    this.info({ environment: process.env.NODE_ENV }, ["Logger inicializado"]);
  }

  setCode(code: string) {
    this.codeHash = code;
  }

  info(message: any, args?: object): void {
    args = { ...args, requestId: this.codeHash };
    console.log(message, JSON.stringify(args));
  }

  error(message: any, args?: object): void {
    args = { ...args, requestId: this.codeHash };
    console.error(message, JSON.stringify(args));
  }
}
