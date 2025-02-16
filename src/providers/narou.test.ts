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

describe(__path, () => {
  return;

  const a = new Narou();

  test("short", async () => {
    const meta = await a.getMetadata("n5338kc");
    eq(meta.onGoing, false);
  });

  test("going", async () => {
    const meta = await a.getMetadata("n2236kb");
    eq(meta.onGoing, true);
  });

  test("completed", async () => {
    const meta = await a.getMetadata("n3620kc");
    eq(meta.onGoing, false);
  });

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
