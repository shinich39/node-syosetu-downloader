"use strict";

import { IChapter } from "./models/chapter";
import { Provider, PROVIDER } from "./models/provider";
import { Alphapolis } from "./providers/alphapolis";
import { Hameln } from "./providers/hameln";
import { Kakuyomu } from "./providers/kakuyomu";
import { Narou } from "./providers/narou";

export * from "./models/provider";
export * from "./models/meta";
export * from "./models/chapter";
export * from "./models/book";

const instances = {
  narou: new Narou(),
  kakuyomu: new Kakuyomu(),
  alphapolis: new Alphapolis(),
  hameln: new Hameln(),
};

export async function getMetadata(provider: Provider, bookId: string) {
  if (provider === "narou") {
    return await instances.narou.getMetadata(bookId);
  } else if (provider === "kakuyomu") {
    return await instances.kakuyomu.getMetadata(bookId);
  } else if (provider === "alphapolis") {
    return await instances.alphapolis.getMetadata(
      bookId.split("/")[0],
      bookId.split("/")[1]
    );
  } else if (provider === "hameln") {
    return await instances.hameln.getMetadata(bookId);
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
    return await instances.narou.getChapter(bookId, chapterId);
  } else if (provider === "kakuyomu") {
    return await instances.kakuyomu.getChapter(bookId, chapterId);
  } else if (provider === "alphapolis") {
    return await instances.alphapolis.getChapter(
      bookId.split("/")[0],
      bookId.split("/")[1],
      chapterId
    );
  } else if (provider === "hameln") {
    return await instances.hameln.getChapter(bookId, chapterId);
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
    return await instances.narou.getBook(bookId, callback);
  } else if (provider === "kakuyomu") {
    return await instances.kakuyomu.getBook(bookId, callback);
  } else if (provider === "alphapolis") {
    return await instances.alphapolis.getBook(
      bookId.split("/")[0],
      bookId.split("/")[1],
      callback
    );
  } else if (provider === "hameln") {
    return await instances.hameln.getBook(bookId, callback);
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}

export async function close() {
  for (const i of Object.values(instances)) {
    await i.close();
  }
}
