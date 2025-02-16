// @ts-nocheck

import { describe, test, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Hameln } from "./hameln";
const __path = path.relative(process.cwd(), fileURLToPath(import.meta.url));
const eq = (a, b, msg) =>
  typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);

// Short: https://syosetu.org/novel/365664/
// Going: https://syosetu.org/novel/367279/
// Completed: https://syosetu.org/novel/201750/

describe(__path, () => {
  return;

  const a = new Hameln();

  test("short", async () => {
    const meta = await a.getMetadata("365664");
    eq(meta.onGoing, false);
    eq(meta.title, "無色のイシ");
    eq(meta.author, "lumi27");
  });

  test("going", async () => {
    const meta = await a.getMetadata("367279");
    eq(meta.onGoing, true);
    eq(meta.title, "ままならないヤンデレ彼女たち");
    eq(meta.author, "過激派ままどおる信者");
  });

  test("completed", async () => {
    const meta = await a.getMetadata("201750");
    eq(meta.onGoing, false);
    eq(meta.title, "初日からPKしたけどデスゲームだったキリトくん");
    eq(meta.author, "〆鯖缶太郎");
  });

  return;

  test("init", async () => {
    return;

    const meta = await a.getMetadata("201750");
    console.log(meta);

    // const data = await h.getBook("299060", (err, chapter, index, length) => {
    //   console.log(err, chapter, index, length);
    // });
    // console.log(data);

    await a.close();
  });

  test("short", async () => {
    return;

    const meta = await a.getMetadata("367061");
    console.log(meta);

    // const data = await h.getBook("367061", (err, chapter, index, length) => {
    //   console.log(err, chapter, index, length);
    // });
    // console.log(data);

    await a.close();
  });

  test("18", async () => {
    return;

    const meta = await a.getMetadata("365043");
    console.log(meta);

    const data = await a.getBook("365043", (err, chapter, index, length) => {
      console.log(err, chapter, index, length);
    });
    console.log(data);

    await a.close();
  });
});
