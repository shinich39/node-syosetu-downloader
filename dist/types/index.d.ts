import { IChapter } from "./models/chapter";
export declare function getMetadata(type: "narou" | "kakuyomu" | "alphapolis" | "hameln", id: string): Promise<import("./models/meta").IMeta>;
export declare function getBook(type: "narou" | "kakuyomu" | "alphapolis" | "hameln", id: string, callback?: (err: unknown | null, chapter: IChapter | null, index: number, length: number) => void): Promise<import("./models/book").IBook>;
//# sourceMappingURL=index.d.ts.map