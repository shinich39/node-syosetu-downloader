"use strict";

import { IChapter } from "./models/chapter";
import { Alphapolis } from "./providers/alphapolis";
import { Hameln } from "./providers/hameln";
import { Kakuyomu } from "./providers/kakuyomu";
import { Narou } from "./providers/narou";

export async function getMetadata(
  type: "narou" | "kakuyomu" | "alphapolis" | "hameln",
  bookId: string
) {
  if (type === "narou") {
    const w = new Narou();
    const data = await w.getMetadata(bookId);
    return data;
  } else if (type === "kakuyomu") {
    const w = new Kakuyomu();
    const data = await w.getMetadata(bookId);
    return data;
  } else if (type === "alphapolis") {
    const w = new Alphapolis();
    const data = await w.getMetadata(
      bookId.split("/")[0],
      bookId.split("/")[1]
    );
    return data;
  } else if (type === "hameln") {
    const w = new Hameln();
    const data = await w.getMetadata(bookId);
    return data;
  } else {
    throw new Error(`Invalid type: ${type}`);
  }
}

export async function getChapter(
  type: "narou" | "kakuyomu" | "alphapolis" | "hameln",
  bookId: string,
  chapterId: string
) {
  if (type === "narou") {
    const w = new Narou();
    const data = await w.getChapter(bookId, chapterId);
    return data;
  } else if (type === "kakuyomu") {
    const w = new Kakuyomu();
    const data = await w.getChapter(bookId, chapterId);
    return data;
  } else if (type === "alphapolis") {
    const w = new Alphapolis();
    const data = await w.getChapter(
      bookId.split("/")[0],
      bookId.split("/")[1],
      chapterId
    );
    await w.close();
    return data;
  } else if (type === "hameln") {
    const w = new Hameln();
    const data = await w.getChapter(bookId, chapterId);
    return data;
  } else {
    throw new Error(`Invalid type: ${type}`);
  }
}

export async function getBook(
  type: "narou" | "kakuyomu" | "alphapolis" | "hameln",
  bookId: string,
  callback?: (
    err: unknown | null,
    chapter: IChapter | null,
    index: number,
    length: number
  ) => void
) {
  if (type === "narou") {
    const w = new Narou();
    const data = await w.getBook(bookId, callback);
    return data;
  } else if (type === "kakuyomu") {
    const w = new Kakuyomu();
    const data = await w.getBook(bookId, callback);
    return data;
  } else if (type === "alphapolis") {
    const w = new Alphapolis();
    const data = await w.getBook(
      bookId.split("/")[0],
      bookId.split("/")[1],
      callback
    );
    await w.close();
    return data;
  } else if (type === "hameln") {
    const w = new Hameln();
    const data = await w.getBook(bookId, callback);
    return data;
  } else {
    throw new Error(`Invalid type: ${type}`);
  }
}
