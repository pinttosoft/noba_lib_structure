import { ExceptionError } from "./exception_error";

export type ExceptionResponseData = {
  [key: string]: ExceptionError[];
};
