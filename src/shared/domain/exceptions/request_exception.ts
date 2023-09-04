import { DomainException } from "./domain_exception";
import { logger } from "../../../index";

export class RequestException extends DomainException {
  constructor(code: string, message: string, data?: []) {
    super();

    logger.info(
      `[REQUEST_EXECEPTION] ${code} - ${message} ${JSON.stringify(data)}`,
    );

    this.name = code;
    this.message = message;
    this.data = data ?? null;
  }
}
