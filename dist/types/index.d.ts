import { IChapter } from "./models/chapter";
import { Provider } from "./models/provider";
export { Provider, PROVIDER } from "./models/provider";
export declare function getMetadata(provider: Provider, bookId: string): Promise<import("./models/meta").IMeta>;
export declare function getChapter(provider: Provider, bookId: string, chapterId: string): Promise<IChapter>;
export declare function getBook(provider: Provider, bookId: string, callback?: (err: unknown | null, chapter: IChapter | null, index: number, length: number) => void): Promise<import("./models/book").IBook>;
//# sourceMappingURL=index.d.ts.map