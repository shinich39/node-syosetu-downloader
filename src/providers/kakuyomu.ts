"use strict";

import dayjs from "dayjs";
import { Web } from "../models/web";
import { getText } from "../utils/util";
import { isObject } from "utils-js";
import { IMeta } from "../models/meta";
import { IChapter } from "../models/chapter";
import { IBook } from "../models/book";

export class Kakuyomu extends Web {
  constructor() {
    super();
  }

  async getMetadata(id: string) {
    const url = `https://kakuyomu.jp/works/${id}`;
    const $ = await this.fetch(url);

    const title = getText($("a[title]").first());
    const outline = getText(
      $(".CollapseTextWithKakuyomuLinks_collapseText__XSlmz")
    );
    const author = getText($('a[href^="/users"]').first());

    let onGoing = false;
    for (const elem of $(".Meta_metaItem__8eZTP").toArray()) {
      const text = $(elem).text();
      if (text.indexOf("連載中") > -1) {
        onGoing = true;
        break;
      } else if (text.indexOf("完結済") > -1) {
        onGoing = false;
        break;
      }
    }

    // let updatedAt = 0;
    // for (const elem of $(".Meta_metaItem__8eZTP").toArray()) {
    //   const text = toHalfWidth($(elem).text()).replace(/\s/g, "");
    //   if (/^[0-9][0-9][0-9][0-9]年[0-9][0-9]?月[0-9][0-9]?日/.test(text)) {
    //     const num = text.replace(/[0-9]/g, "");
    //     updatedAt = dayjs(num, "YYYYMD").valueOf();
    //   }
    // }

    let createdAt = 0;
    let updatedAt = 0;
    const chapters = [];
    const nextData = JSON.parse($("#__NEXT_DATA__").text());
    for (const obj of Object.values(
      nextData.props.pageProps.__APOLLO_STATE__
    )) {
      if (!isObject(obj)) {
        continue;
      }
      if (obj.__typename === "Episode") {
        const publishedAt = dayjs(obj.publishedAt).valueOf();
        if (!createdAt) {
          createdAt = publishedAt;
        } else if (createdAt > publishedAt) {
          createdAt = publishedAt;
        }
        if (!updatedAt) {
          updatedAt = publishedAt;
        } else if (updatedAt < publishedAt) {
          updatedAt = publishedAt;
        }
        chapters.push({
          id: obj.id,
          publishedAt: publishedAt,
        });
      }
    }

    chapters.sort((a, b) => a.publishedAt - b.publishedAt);

    const result: IMeta = {
      onGoing: onGoing,
      title: title,
      outline: outline,
      author: author,
      chapterIds: chapters.map((item) => item.id),
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    if (result.title === "" || result.author === "") {
      throw new Error("Metadata not found");
    }

    return result;
  }

  async getChapter(nid: string, cid: string) {
    const url = `https://kakuyomu.jp/works/${nid}/episodes/${cid}`;
    const $ = await this.fetch(url);

    const title = getText($("#contentMain-header"));

    let i = 1,
      elem = $(`#p${i}`);

    const lines: string[] = [];
    while (elem.length !== 0) {
      lines.push(elem.text());
      i++;
      elem = $(`#p${i}`);
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
