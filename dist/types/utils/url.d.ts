import { Provider } from "../models/provider";
export declare function createURL(provider: Provider | string, id: string): string;
export declare function parseURL(str: string): {
    url: string;
    provider: Provider;
    id: string;
}[];
//# sourceMappingURL=url.d.ts.map