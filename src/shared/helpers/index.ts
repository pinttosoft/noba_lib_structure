import { DomainException } from "../domain/exceptions/domain_exception";
import {
  ExceptionError,
  ExceptionResponseData,
  HttpStatus,
  logger,
  RequestException,
} from "../../index";

export const removeUndefined = (arr: any) => {
  for (const key in arr) {
    if (arr[key] === undefined) {
      delete arr[key];
    }
  }

  return arr;
};

export const exceptionResponse = (e, res: any) => {
  if (e instanceof DomainException || e instanceof RequestException) {
    logger.info(`[lib NOBA_LIB_DI exceptionResponse] e: `, e.getMessage());

    if (e.getData()?.length > 0) {
      res.status(HttpStatus.BAD_REQUEST).send({
        code: e.getErrorCode(),
        message: e.getMessage(),
        data:
          e instanceof RequestException ? prepareErrorData(e.getData()) : null,
      });
      return;
    }

    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ code: e.getErrorCode(), message: e.getMessage() });
    return;
  }

  logger.info(`[lib NOBA_LIB_DI exceptionResponse] e: `, e);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
};

// TODO esto aplica apenas para prime trust
const prepareErrorData = (data: any): ExceptionResponseData => {
  const errors: ExceptionError[] = [];
  data.forEach((err: any): void => {
    errors.push({
      field: err.source.pointer.replace("/data/attributes/", ""),
      message: err.detail,
    });
  });

  return {
    warning: errors,
  };
};
