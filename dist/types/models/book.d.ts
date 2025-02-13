import { IChapter } from "./chapter";
export interface IBook {
    onGoing: boolean;
    title: string;
    author: string;
    outline: string;
    chapters: IChapter[];
    createdAt: number;
    updatedAt: number;
}
//# sourceMappingURL=book.d.ts.map