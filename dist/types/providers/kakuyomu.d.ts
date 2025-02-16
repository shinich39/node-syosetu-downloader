import { IWeb, Web } from "../models/web";
import { IMeta } from "../models/meta";
import { IChapter } from "../models/chapter";
import { IBook } from "../models/book";
export declare class Kakuyomu extends Web {
    constructor(options?: IWeb);
    getMetadata(id: string): Promise<IMeta>;
    getChapter(nid: string, cid: string): Promise<IChapter>;
    getBook(id: string, callback?: (err: unknown | null, chapter: IChapter | null, index: number, length: number) => void): Promise<IBook>;
}
//# sourceMappingURL=kakuyomu.d.ts.map