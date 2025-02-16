"use strict";

import dayjs from "dayjs";
import { IWeb, Web } from "../models/web";
import { getText, toInt } from "../utils/util";
import { toHalfWidth } from "utils-js";
import { IMeta } from "../models/meta";
import { IChapter } from "../models/chapter";
import { IBook } from "../models/book";

export class Narou extends Web {
  constructor(options?: IWeb) {
    super(options);
  }

  async getMetadata(id: string) {
    const url = `https://ncode.syosetu.com/novelview/infotop/ncode/${id}/`;
    const $ = await this.fetch(url);

    let isShort = false,
      onGoing = true;
    const infoStr = getText($("#pre_info"));
    if (infoStr.indexOf("短編") > -1) {
      isShort = true;
      onGoing = false;
    } else if (infoStr.indexOf("完結済") > -1) {
      isShort = false;
      onGoing = false;
    } else {
      isShort = false;
      onGoing = true;
    }
    const title = getText($("#contents_main > h1 > a"));
    const author = getText($("#noveltable1 tbody tr:nth-child(2) td"));
    const outline = getText($("#noveltable1 tbody tr:nth-child(1) td"));

    const createdAtStr = getText(
      $("#noveltable2 tbody tr:nth-child(1) td")
    ).replace(/[^0-9]/g, "");

    const updatedAtStr = getText(
      $("#noveltable2 tbody tr:nth-child(2) td")
    ).replace(/[^0-9]/g, "");

    const createdAt =
      createdAtStr.length === 12
        ? dayjs(createdAtStr, "YYYYMMDDHHmm").valueOf()
        : 0;

    const updatedAt = isShort
      ? createdAt
      : updatedAtStr.length === 12
        ? dayjs(updatedAtStr, "YYYYMMDDHHmm").valueOf()
        : 0;

    const chapterCount = toInt(
      toHalfWidth($("#pre_info").text()).match(/全([0-9]+)エピソード/)?.[1] ||
        ""
    );

    const chapterIds: string[] = [];
    if (isShort) {
      chapterIds.push("");
    } else {
      for (let i = 0; i < chapterCount; i++) {
        chapterIds.push("" + (i + 1));
      }
    }

    const result: IMeta = {
      onGoing: onGoing,
      title: title,
      outline: outline,
      author: author,
      chapterIds: chapterIds,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    if (result.title === "" || result.author === "") {
      throw new Error("Metadata not found");
    }

    return result;
  }

  async getChapter(nid: string, cid: string) {
    const url =
      cid === ""
        ? // short
          `https://ncode.syosetu.com/${nid}`
        : // long
          `https://ncode.syosetu.com/${nid}/${cid}`;
    const $ = await this.fetch(url);

    const title = getText($("h1.p-novel__title"));

    let i = 1,
      elem = $(`#L${i}`);
    const lines: string[] = [];
    while (elem.length !== 0) {
      lines.push(elem.text());
      i++;
      elem = $(`#L${i}`);
    }

    const result: IChapter = {
      id: cid,
      title,
      content: lines.join("\n"),
    };

    return result;
  }

  async getBook(
    id: string,
    callback?: (
      err: unknown | null,
      chapter: IChapter | null,
      index: number,
      length: number
    ) => void
  ) {
    const meta = await this.getMetadata(id);
    const chapters: IChapter[] = [];
    const len = meta.chapterIds.length;
    for (let i = 0; i < len; i++) {
      try {
        const chapterId = meta.chapterIds[i];
        const chapter = await this.getChapter(id, chapterId);
        chapters.push(chapter);
        if (callback) {
          callback(null, chapter, i, len);
        }
      } catch (err) {
        if (callback) {
          callback(err, null, i, len);
        }
      }
    }

    const result: IBook = {
      ...meta,
      chapters,
    };

    return result;
  }
}
