"use strict";

import dayjs from "dayjs";
import { clickElement, IWeb, waitContent, Web } from "../models/web";
import { getText, toInt } from "../utils/util";
import { toHalfWidth } from "utils-js";
import { IMeta } from "../models/meta";
import { IChapter } from "../models/chapter";
import { IBook } from "../models/book";

export class Alphapolis extends Web {
  constructor(options?: IWeb) {
    super(options);
  }

  async getMetadata(uid: string, nid: string) {
    const url = `https://www.alphapolis.co.jp/novel/${uid}/${nid}`;
    const $ = await this.fetch(url);

    const table = $("table.detail");

    const getTableText = function (field: string) {
      return getText(
        table
          .find("th")
          .filter(function () {
            return $(this).text().trim() === field;
          })
          .next()
      );
    };

    const onGoing = /連載中/.test(getText($(".content-status.complete")));
    const title = getText($("h1.title"));
    const author = getText($(".author"));
    const outline = getText($(".abstract").first());

    // 2025.01.11 18:07
    // 202501111807
    // YYYYMMDDHHmm
    const createdAtStr = getTableText("初回公開日時").replace(/[^0-9]/g, "");

    const updatedAtStr = getTableText("更新日時").replace(/[^0-9]/g, "");

    const createdAt =
      createdAtStr.length === 12
        ? dayjs(createdAtStr, "YYYYMMDDHHmm").valueOf()
        : 0;

    const updatedAt =
      updatedAtStr.length === 12
        ? dayjs(updatedAtStr, "YYYYMMDDHHmm").valueOf()
        : 0;

    const chapterIds: string[] = [];
    // for (let i = 0; i < chapterCount; i++) {
    //   chapterIds.push(i + 1);
    // }

    // 'https://www.alphapolis.co.jp/novel/292625099/906732223/episode/6854838'
    for (const elem of $("div.episode a").toArray()) {
      const href = elem.attribs.href;
      const cid = href.split("/").pop();
      if (!cid) {
        throw new Error(`ChapterID not found: ${href}`);
      }
      chapterIds.push(cid);
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

  async getChapter(uid: string, nid: string, cid: string) {
    const url = `https://www.alphapolis.co.jp/novel/${uid}/${nid}/episode/${cid}`;
    const $ = await this.load(url, null, async (page) => {
      let i = 0;
      while (i < 10) {
        i++;
        // Remove content saver
        try {
          await clickElement(page, "#TopLayer", 0);
        } catch (err) {
          // eslint-disable-next-line
        }
        try {
          await waitContent(
            page,
            "#novelBody",
            (str) => toHalfWidth(str).trim() !== "",
            1000
          );
          return;
        } catch (err) {
          // eslint-disable-next-line
        }
      }
      throw new Error("Content not found");
    });

    const title = getText($(".episode-title"));
    const content = $("#novelBody").find("br").replaceWith("\n").end().text();

    const result: IChapter = {
      id: cid,
      title,
      content,
    };

    return result;
  }

  async getBook(
    uid: string,
    nid: string,
    callback?: (
      err: unknown | null,
      chapter: IChapter | null,
      index: number,
      length: number
    ) => void
  ) {
    const meta = await this.getMetadata(uid, nid);
    const chapters: IChapter[] = [];
    const len = meta.chapterIds.length;
    for (let i = 0; i < len; i++) {
      try {
        const chapterId = meta.chapterIds[i];
        const chapter = await this.getChapter(uid, nid, chapterId);
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
