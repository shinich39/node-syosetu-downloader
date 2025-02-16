import { IWeb, Web } from "../models/web";
import { IMeta } from "../models/meta";
import { IChapter } from "../models/chapter";
import { IBook } from "../models/book";
export declare class Alphapolis extends Web {
    constructor(options?: IWeb);
    getMetadata(uid: string, nid: string): Promise<IMeta>;
    getChapter(uid: string, nid: string, cid: string): Promise<IChapter>;
    getBook(uid: string, nid: string, callback?: (err: unknown | null, chapter: IChapter | null, index: number, length: number) => void): Promise<IBook>;
}
//# sourceMappingURL=alphapolis.d.ts.map