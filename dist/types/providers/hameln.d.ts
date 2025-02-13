import { Web } from "../models/web";
import { IMeta } from "../models/meta";
import { IChapter } from "../models/chapter";
import { IBook } from "../models/book";
export declare class Hameln extends Web {
    constructor();
    getMetadata(id: string): Promise<IMeta>;
    getChapter(nid: string, cid: string, seq: number): Promise<IChapter>;
    getBook(id: string, callback?: (err: unknown | null, chapter: IChapter | null, index: number, length: number) => void): Promise<IBook>;
}
//# sourceMappingURL=hameln.d.ts.map