// @ts-nocheck

import { describe, test, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { parseURL } from "./url";
const __abs = fileURLToPath(import.meta.url);
const __rel = path.relative(process.cwd(), __abs);
const __dirname = path.dirname(__abs);
const __filename = path.basename(__abs);

const eq = (a, b, msg) =>
  typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);

const log = (obj) => {
  fs.writeFileSync(
    path.join(__abs + ".json"),
    JSON.stringify(obj, null, 2),
    "utf8"
  );
};

describe(__rel, () => {
  test("narou", () => {
    const str = "https://ncode.syosetu.com/n6868jy/";
    const res = parseURL(str);
    eq(res[0].url, str);
    eq(res[0].provider, "narou");
    eq(res[0].id, "n6868jy");
  });

  test("narou18", () => {
    const str = "https://novel18.syosetu.com/n0704ik/";
    const res = parseURL(str);
    eq(res[0].url, str);
    eq(res[0].provider, "narou");
    eq(res[0].id, "n0704ik");
  });

  test("narou18", () => {
    const str = "https://kakuyomu.jp/works/16818093091144290179";
    const res = parseURL(str);
    eq(res[0].url, str);
    eq(res[0].provider, "kakuyomu");
    eq(res[0].id, "16818093091144290179");
  });

  test("hameln", () => {
    const str = "https://syosetu.org/novel/366997/";
    const res = parseURL(str);
    eq(res[0].url, str);
    eq(res[0].provider, "hameln");
    eq(res[0].id, "366997");
  });

  test("alphapolis", () => {
    const str =
      "https://www.alphapolis.co.jp/novel/685705691/683939114/episode/9317217";
    const res = parseURL(str);
    eq(res[0].url, "https://www.alphapolis.co.jp/novel/685705691/683939114/");
    eq(res[0].provider, "alphapolis");
    eq(res[0].id, "685705691/683939114");
  });
});
