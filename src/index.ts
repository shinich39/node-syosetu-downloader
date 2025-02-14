"use strict";

import { IChapter } from "./models/chapter";
import { Provider, PROVIDER } from "./models/provider";
import { Alphapolis } from "./providers/alphapolis";
import { Hameln } from "./providers/hameln";
import { Kakuyomu } from "./providers/kakuyomu";
import { Narou } from "./providers/narou";

export { Provider, PROVIDER } from "./models/provider";

export async function getMetadata(provider: Provider, bookId: string) {
  if (provider === "narou") {
    const w = new Narou();
    const data = await w.getMetadata(bookId);
    return data;
  } else if (provider === "kakuyomu") {
    const w = new Kakuyomu();
    const data = await w.getMetadata(bookId);
    return data;
  } else if (provider === "alphapolis") {
    const w = new Alphapolis();
    const data = await w.getMetadata(
      bookId.split("/")[0],
      bookId.split("/")[1]
    );
    return data;
  } else if (provider === "hameln") {
    const w = new Hameln();
    const data = await w.getMetadata(bookId);
    return data;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}

export async function getChapter(
  provider: Provider,
  bookId: string,
  chapterId: string
) {
  if (provider === "narou") {
    const w = new Narou();
    const data = await w.getChapter(bookId, chapterId);
    return data;
  } else if (provider === "kakuyomu") {
    const w = new Kakuyomu();
    const data = await w.getChapter(bookId, chapterId);
    return data;
  } else if (provider === "alphapolis") {
    const w = new Alphapolis();
    const data = await w.getChapter(
      bookId.split("/")[0],
      bookId.split("/")[1],
      chapterId
    );
    await w.close();
    return data;
  } else if (provider === "hameln") {
    const w = new Hameln();
    const data = await w.getChapter(bookId, chapterId);
    return data;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}

export async function getBook(
  provider: Provider,
  bookId: string,
  callback?: (
    err: unknown | null,
    chapter: IChapter | null,
    index: number,
    length: number
  ) => void
) {
  if (provider === "narou") {
    const w = new Narou();
    const data = await w.getBook(bookId, callback);
    return data;
  } else if (provider === "kakuyomu") {
    const w = new Kakuyomu();
    const data = await w.getBook(bookId, callback);
    return data;
  } else if (provider === "alphapolis") {
    const w = new Alphapolis();
    const data = await w.getBook(
      bookId.split("/")[0],
      bookId.split("/")[1],
      callback
    );
    await w.close();
    return data;
  } else if (provider === "hameln") {
    const w = new Hameln();
    const data = await w.getBook(bookId, callback);
    return data;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}
