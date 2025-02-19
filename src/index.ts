"use strict";

import { IBook } from "./models/book";
import { IChapter } from "./models/chapter";
import { IMeta } from "./models/meta";
import { Provider, PROVIDER } from "./models/provider";
import { IWeb } from "./models/web";
import { Alphapolis } from "./providers/alphapolis";
import { Hameln } from "./providers/hameln";
import { Kakuyomu } from "./providers/kakuyomu";
import { Narou } from "./providers/narou";

export * from "./models/provider";
export * from "./models/meta";
export * from "./models/chapter";
export * from "./models/book";
export * from "./utils/url";

const instances = {
  narou: new Narou(),
  kakuyomu: new Kakuyomu(),
  alphapolis: new Alphapolis(),
  hameln: new Hameln(),
};

export async function setCacheDir(dirPath: string) {
  instances.narou.cacheDir = dirPath;
  instances.kakuyomu.cacheDir = dirPath;
  instances.alphapolis.cacheDir = dirPath;
  instances.hameln.cacheDir = dirPath;
}

export async function getMetadata(provider: Provider, bookId: string) {
  let data: IMeta;
  if (provider === "narou") {
    data = await instances.narou.getMetadata(bookId);
  } else if (provider === "kakuyomu") {
    data = await instances.kakuyomu.getMetadata(bookId);
  } else if (provider === "alphapolis") {
    data = await instances.alphapolis.getMetadata(
      bookId.split("/")[0],
      bookId.split("/")[1]
    );
  } else if (provider === "hameln") {
    data = await instances.hameln.getMetadata(bookId);
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }

  if (data.title.trim() === "") {
    throw new Error("Title not found");
  }
  if (data.author.trim() === "") {
    throw new Error("Author not found");
  }

  return data;
}

export async function getChapter(
  provider: Provider,
  bookId: string,
  chapterId: string
) {
  let data: IChapter;
  if (provider === "narou") {
    data = await instances.narou.getChapter(bookId, chapterId);
  } else if (provider === "kakuyomu") {
    data = await instances.kakuyomu.getChapter(bookId, chapterId);
  } else if (provider === "alphapolis") {
    data = await instances.alphapolis.getChapter(
      bookId.split("/")[0],
      bookId.split("/")[1],
      chapterId
    );
  } else if (provider === "hameln") {
    data = await instances.hameln.getChapter(bookId, chapterId);
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }

  if (data.title.trim() === "") {
    throw new Error("Title not found");
  }

  return data;
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
  let data: IBook;
  if (provider === "narou") {
    data = await instances.narou.getBook(bookId, callback);
  } else if (provider === "kakuyomu") {
    data = await instances.kakuyomu.getBook(bookId, callback);
  } else if (provider === "alphapolis") {
    data = await instances.alphapolis.getBook(
      bookId.split("/")[0],
      bookId.split("/")[1],
      callback
    );
  } else if (provider === "hameln") {
    data = await instances.hameln.getBook(bookId, callback);
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }

  if (data.title.trim() === "") {
    throw new Error("Title not found");
  }
  if (data.author.trim() === "") {
    throw new Error("Author not found");
  }

  return data;
}

export async function close() {
  for (const i of Object.values(instances)) {
    await i.close();
  }
}
