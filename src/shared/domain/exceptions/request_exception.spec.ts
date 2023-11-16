import { RequestException } from "./request_exception";

describe("RequestException", () => {
  it("should be defined", () => {
    new RequestException(
      "400",
      "Unable to find customer with id [AngelVicen-186263254]",
    );
  });
});
