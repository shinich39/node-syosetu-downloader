import * as cheerio from "cheerio";
import { Browser, GoToOptions, Page } from "puppeteer";
export declare function getElement(page: Page, selector: string, timeout?: number): Promise<cheerio.Cheerio<import("domhandler").AnyNode>>;
export declare function getContent(page: Page, selector: string, timeout?: number): Promise<string | null>;
export declare function clickElement(page: Page, selector: string, timeout?: number): Promise<void>;
export declare function waitContent(page: Page, selector: string, validator: (content: string) => boolean, timeout?: number): Promise<string>;
export interface IWeb {
    cacheDir: string;
    isOpened: boolean;
    browser?: Browser;
    pageOptions?: GoToOptions;
}
export declare class Web implements IWeb {
    cacheDir: string;
    isOpened: boolean;
    browser?: Browser;
    pageOptions?: GoToOptions;
    constructor(options?: IWeb);
    open(): Promise<void>;
    close(): Promise<void>;
    load(url: string, selectors?: string[] | null, onLoad?: (page: Page) => Promise<void>): Promise<cheerio.CheerioAPI>;
    fetch(url: string, options?: RequestInit): Promise<cheerio.CheerioAPI>;
}
//# sourceMappingURL=web.d.ts.map