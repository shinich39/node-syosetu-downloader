// @ts-nocheck

import { describe, test, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Narou } from "./narou";
const __path = path.relative(process.cwd(), fileURLToPath(import.meta.url));
const eq = (a, b, msg) =>
  typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);

// Short: https://ncode.syosetu.com/n5338kc/
// Going: https://ncode.syosetu.com/n2236kb/
// Completed: https://ncode.syosetu.com/n3620kc/
// 18: https://novel18.syosetu.com/n3193jo/

describe(__path, () => {
  return;

  const a = new Narou();

  test("short", async () => {
    const meta = await a.getMetadata("n5338kc");
    eq(meta.onGoing, false);
    eq(meta.title, "踊り子の影");
    eq(meta.author, "コンマツケ");
  });

  test("going", async () => {
    const meta = await a.getMetadata("n2236kb");
    eq(meta.onGoing, true);
    eq(meta.title, "デス・ガンスリンガー 〜戦場に生きる最強の亡霊〜");
    eq(meta.author, "雨宮悠理");
  });

  test("completed", async () => {
    const meta = await a.getMetadata("n3620kc");
    eq(meta.onGoing, false);
    eq(meta.title, "恋人の多様性");
    eq(meta.author, "ちゃもちょあちゃ");
  });

  test("18", async () => {
    const meta = await a.getMetadata("n3193jo");
    eq(meta.onGoing, true);
    eq(
      meta.title,
      "アナタの小説が一次選考落選なのは、過激な描写が多いからです"
    );
    eq(meta.author, "天界 聖夜");
  });

  return;

  test("init", async () => {
    return;

    const meta = await n.getMetadata("n3620kc");
    console.log(meta);

    // const data = await n.getBook("n3620kc", (err, chapter, index, length) => {
    //   console.log(err, chapter, index, length);
    // });
    // console.log(data);
  });

  test("short", async () => {
    return;

    const n = new Narou();

    const meta = await n.getMetadata("n4525kc");
    console.log(meta);

    const data = await n.getBook("n4525kc", (err, chapter, index, length) => {
      console.log(err, chapter, index, length);
    });
    console.log(data);
  });

  test("18", async () => {
    return;

    const n = new Narou();

    const meta = await n.getMetadata("n0186jn");
    console.log(meta);

    const data = await n.getBook("n0186jn", (err, chapter, index, length) => {
      console.log(err, chapter, index, length);
    });
    console.log(data);
  });
});
