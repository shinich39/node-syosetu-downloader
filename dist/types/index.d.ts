import { IChapter } from "./models/chapter";
export declare function getMetadata(provider: "narou" | "kakuyomu" | "alphapolis" | "hameln", bookId: string): Promise<import("./models/meta").IMeta>;
export declare function getChapter(provider: "narou" | "kakuyomu" | "alphapolis" | "hameln", bookId: string, chapterId: string): Promise<IChapter>;
export declare function getBook(provider: "narou" | "kakuyomu" | "alphapolis" | "hameln", bookId: string, callback?: (err: unknown | null, chapter: IChapter | null, index: number, length: number) => void): Promise<import("./models/book").IBook>;
//# sourceMappingURL=index.d.ts.map