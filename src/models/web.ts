"use strict";

import * as cheerio from "cheerio";
import { Browser, GoToOptions, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Cookie, CookieJar } from "tough-cookie";
import fetchCookie from "fetch-cookie";
import { wait } from "utils-js";

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

// set adult cookies
const cookieJar = new CookieJar();
// narou
cookieJar.setCookieSync("over18=yes", "https://novel18.syosetu.com/");
// hameln
cookieJar.setCookieSync("over18=off", "https://syosetu.org/");
const fetchWithCookies = fetchCookie(fetch, cookieJar);

export async function getElement(
  page: Page,
  selector: string,
  timeout: number = 0
) {
  let i = 0;
  while (i <= timeout) {
    const elem = await page.$(selector);
    if (elem) {
      const $ = cheerio.load(await page.content());
      return $(selector);
    }
    await wait(256);
    i += 256;
  }
  throw new Error(`Element not found: ${selector}`);
}

async function findElement(page: Page, selector: string, timeout: number = 0) {
  let i = 0;
  while (i <= timeout) {
    const elem = await page.$(selector);
    if (elem) {
      return elem;
    }
    await wait(256);
    i += 256;
  }
  throw new Error(`Element not found: ${selector}`);
}

export async function getContent(
  page: Page,
  selector: string,
  timeout: number = 0
) {
  const element = await findElement(page, selector, timeout);
  const content = await page.evaluate((elem) => elem?.textContent, element);
  return content;
}

export async function clickElement(
  page: Page,
  selector: string,
  timeout: number = 0
) {
  await findElement(page, selector, timeout);
  await page.click(selector);
}

export async function waitContent(
  page: Page,
  selector: string,
  validator: (content: string) => boolean,
  timeout: number = 0
) {
  let i = 0;
  while (i <= timeout) {
    const content = await getContent(page, selector);
    if (content && validator(content)) {
      return content;
    }
    await wait(256);
    i += 256;
  }
  throw new Error(`Content not found: ${selector}`);
}

export class Web {
  cacheDir: string;
  isOpened: boolean;
  browser?: Browser;
  pageOptions?: GoToOptions;

  constructor() {
    this.isOpened = false;
    this.cacheDir = ".puppeteer";
  }

  async open() {
    if (!this.isOpened) {
      this.isOpened = true;
      this.browser = await puppeteer.launch({
        // headless: false,
        // args: ["--no-sandbox"],
        userDataDir: this.cacheDir,
        // executablePath: "google-chrome-stable",
      });
    }

    // wait browser launched
    while (!this.browser) {
      await wait(128);
    }
  }

  async close() {
    if (this.isOpened) {
      while (!this.browser) {
        await wait(128);
      }
      const b = this.browser;
      this.browser = undefined;
      this.isOpened = false;
      await b.close();
    }
  }

  async load(
    url: string,
    selectors?: string[] | null,
    onLoad?: (page: Page) => Promise<void>
  ) {
    if (!selectors) {
      selectors = [];
    }

    await this.open();

    if (!this.browser) {
      throw new Error("Browser not found");
    }

    const page = await this.browser.newPage();
    try {
      await page.goto(url, this.pageOptions);

      for (const selector of selectors) {
        const timer = setTimeout(() => {
          throw new Error(`Element not found: ${selector}`);
        }, 1000 * 10);

        await page.waitForSelector(selector, {
          visible: true,
          timeout: 0,
        });

        clearTimeout(timer);
      }

      if (onLoad) {
        await onLoad(page);
      }

      const content = await page.content();
      const $ = cheerio.load(content);
      await page.close();
      return $;
    } catch (err) {
      await page.close();
      throw err;
    }
  }

  async fetch(url: string, options?: RequestInit) {
    // const options:RequestInit = {}
    // if (cookies) {
    //   options.headers = {
    //     cookie: Object.entries(cookies).map((item) => `${item[0]}=${item[1]}`).join("; "),
    //   }
    // }

    const response = await fetchWithCookies(url, options);
    if (!response.ok) {
      throw new Error("Fetching failed");
    }

    const content = await response.text();
    const $ = cheerio.load(content);
    return $;
  }
}
