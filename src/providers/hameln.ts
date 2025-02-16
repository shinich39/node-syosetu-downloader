"use strict";

import dayjs from "dayjs";
import { IWeb, Web } from "../models/web";
import { getText, toInt } from "../utils/util";
import { IMeta } from "../models/meta";
import { IChapter } from "../models/chapter";
import { IBook } from "../models/book";

export class Hameln extends Web {
  constructor(options?: IWeb) {
    super(options);
  }

  async getMetadata(id: string) {
    const url = `https://syosetu.org/?mode=ss_detail&nid=${id}`;
    const $ = await this.fetch(url);

    const getTableText = function (field: string) {
      return getText(
        $("td")
          .filter(function () {
            return $(this).text().trim() === field;
          })
          .next()
      );
    };

    const onGoing = !/短編|完結/.test(getTableText("話数"));
    const title = getTableText("タイトル");
    const author = getTableText("作者");
    const outline = getTableText("あらすじ");
    const chapterCount = parseInt(getTableText("話数").replace(/[^0-9]/g, ""));

    // 2022年10月01日(土) 07:35
    // 202210010735
    // YYYYMMDDHHmm
    const createdAtStr = getTableText("掲載開始").replace(/[^0-9]/g, "");

    const updatedAtStr = getTableText("最新投稿").replace(/[^0-9]/g, "");

    const createdAt =
      createdAtStr.length === 12
        ? dayjs(createdAtStr, "YYYYMMDDHHmm").valueOf()
        : 0;

    const updatedAt =
      updatedAtStr.length === 12
        ? dayjs(updatedAtStr, "YYYYMMDDHHmm").valueOf()
        : 0;

    const chapterIds: string[] = [];
    for (let i = 0; i < chapterCount; i++) {
      chapterIds.push("" + (i + 1));
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
    const url = `https://syosetu.org/novel/${nid}/${cid}.html`;
    const $ = await this.fetch(url);

    const title = getText($("#analytics_start").prev());

    let i = 0,
      elem = $(`#${i}`);
    const lines: string[] = [];
    while (elem.length !== 0) {
      lines.push(elem.text());
      i++;
      elem = $(`#${i}`);
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
