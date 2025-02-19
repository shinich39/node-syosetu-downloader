import { IBook } from "./models/book";
import { IChapter } from "./models/chapter";
import { IMeta } from "./models/meta";
import { Provider } from "./models/provider";
export * from "./models/provider";
export * from "./models/meta";
export * from "./models/chapter";
export * from "./models/book";
export * from "./utils/url";
export declare function setCacheDir(dirPath: string): Promise<void>;
export declare function getMetadata(provider: Provider, bookId: string): Promise<IMeta>;
export declare function getChapter(provider: Provider, bookId: string, chapterId: string): Promise<IChapter>;
export declare function getBook(provider: Provider, bookId: string, callback?: (err: unknown | null, chapter: IChapter | null, index: number, length: number) => void): Promise<IBook>;
export declare function close(): Promise<void>;
//# sourceMappingURL=index.d.ts.map