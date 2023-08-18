import { exceptionError } from "./ExceptionError";

export type exceptionResponseData = {
  [key: string]: exceptionError[];
};
