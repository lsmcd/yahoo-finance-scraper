import YahooFinanceScraper from "./index";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";

beforeAll(() => {
  return YahooFinanceScraper.init();
});

afterAll(() => {
  return YahooFinanceScraper.exit();
});

describe("Retrieve Quotes", () => {
  test("Retrieves 3 stocks asynchronously", async () => {
    await Promise.all([
      YahooFinanceScraper.fetchQuote("AMD").then((quote) => {
        expect(quote.livePrice.price).toBeTruthy();
      }),
      YahooFinanceScraper.fetchQuote("INTC").then((quote) => {
        expect(quote.livePrice.time).toBeTruthy();
      }),
      YahooFinanceScraper.fetchQuote("NVDA").then((quote) => {
        expect(quote.afterHoursPrice.priceChange).toBeTruthy();
      }),
    ]);
  }, 500000);
  test("Retrieves Nvidia's current stock price", async () => {
    const quote = await YahooFinanceScraper.fetchQuote("NVDA");
    expect(quote.livePrice.price).toBeTruthy();
  }, 300000);
  test("Retrieves Nvidia's current stock chart", async () => {
    const quote = await YahooFinanceScraper.fetchQuote("NVDA", "3M");
    expect(quote.priceChart).toBeTruthy();
  }, 300000);
});
