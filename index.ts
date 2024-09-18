import puppeteer, { Browser } from "puppeteer";

/**
 * @type {quote}
 */
type quote = {
  livePrice: {
    price: string;
    priceChange: string;
    priceChangePercent: string;
    time: string;
  };
  afterHoursPrice: {
    price: string;
    priceChange: string;
    priceChangePercent: string;
    time: string;
  };
  priceChart: priceChart[];
};

type priceChart = {
  price: string;
  time: string;
};

/**
 * Main class used for all API calls
 */
class YahooFinanceScraper {
  static browser: Browser;
  /**
   * Async method required to initialize the API
   * @returns {Promise<void>}
   */
  public static async init(): Promise<void> {
    if (this.browser) {
      console.error("YahooFinanceScraper has already been initialized");
    } else {
      this.browser = await puppeteer.launch();
    }
  }
  /**
   * Async method that in all use cases should be used at shutdown
   * @returns {Promise<void>}
   */
  public static async exit(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    } else {
      console.error("YahooFinanceScraper has not been initialized");
    }
  }
  /**
   * Async method that fetches a quote.
   * @param {string} ticker - The stocks ticker string as used in the url.
   * @returns Promise<quote>
   */
  public static async fetchQuote(
    ticker: string,
    priceChart?: string,
  ): Promise<quote> {
    if (!this.browser) {
      throw Error(
        "Must initialize YahooFinanceScraper with async init() method and don't forget exit()",
      );
    }

    const page = await this.browser.newPage();

    await page.goto(`https://finance.yahoo.com/quote/${ticker}/`);

    await page.setViewport({ width: 1920, height: 1024 });

    const quote = await page.evaluate(() => {
      /* INFO: The following comments are there because if the scraper malfunctions 
         I would prefer if it threw an error rather than provide null values */
      try {
        const livePrice = document.querySelector("fin-streamer.livePrice");
        const price = document.querySelector("fin-streamer.price");
        const data: quote = {
          livePrice: {
            // @ts-expect-error: Object is possibly 'null'.
            price: livePrice.textContent,
            // @ts-expect-error: Object is possibly 'null'.
            priceChange: livePrice.parentNode.children[1].textContent,
            // @ts-expect-error: Object is possibly 'null'.
            priceChangePercent: livePrice.parentNode.children[2].textContent,
            // @ts-expect-error: Object is possibly 'null'.
            time: livePrice.parentNode.parentNode.children[1].textContent,
          },
          afterHoursPrice: {
            // @ts-expect-error: Object is possibly 'null'.
            price: price.textContent,
            // @ts-expect-error: Object is possibly 'null'.
            priceChange: price.parentNode.children[1].textContent,
            // @ts-expect-error: Object is possibly 'null'.
            priceChangePercent: price.parentNode.children[2].textContent,
            // @ts-expect-error: Object is possibly 'null'.
            time: price.parentNode.parentNode.children[1].textContent,
          },
          priceChart: [],
        };
        return data;
      } catch (err) {
        console.error(err);
      }
    });

    if (quote) {
      // WARN: EXTREMELY SLOW
      if (priceChart) {
        try {
          for (let i = 0; i < 1200; i++) {
            await page.hover("div.stx-subholder");
            await page.mouse.move(360 + i, 500);
            const element = await page.$("table.hu-tooltip > tbody");
            if (!element) break;
            if (await element.isVisible()) {
              const tempPriceChart = await page.evaluate((): priceChart => {
                const tbody = document.querySelector(
                  "table.hu-tooltip > tbody",
                );
                return {
                  // @ts-expect-error: Object is possibly 'null'.
                  price: tbody.children[1].children[1].textContent,
                  // @ts-expect-error: Object is possibly 'null'.
                  time: tbody.children[0].children[1].textContent,
                };
              });
              if (
                quote.priceChart[quote.priceChart.length - 1] &&
                tempPriceChart.time ===
                  quote.priceChart[quote.priceChart.length - 1].time
              ) {
                continue;
              }
              quote.priceChart.push(tempPriceChart);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }

      await page.close();
      return quote;
    } else {
      throw new Error("Failed to retrieve quote");
    }
  }
}

export default YahooFinanceScraper;
