import { describe, test, expect } from "@jest/globals";
import timestamp from "./timestamp";

describe("Timestamp converter", () => {
  test("Get timestamp", () => {
    expect(timestamp("12:00:00 AM EST")).toBeInstanceOf(Date);
  });
});
