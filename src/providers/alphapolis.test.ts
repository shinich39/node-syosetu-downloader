// @ts-nocheck

import { describe, test, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Alphapolis } from "./alphapolis";
const __path = path.relative(process.cwd(), fileURLToPath(import.meta.url));
const eq = (a, b, msg) =>
  typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);

// Short Going: https://www.alphapolis.co.jp/novel/643190032/456940721
// Short Completed: https://www.alphapolis.co.jp/novel/501580631/997939367
// Going: https://www.alphapolis.co.jp/novel/76166291/213939438
// Completed: https://www.alphapolis.co.jp/novel/77586146/733940483


describe(__path, () => {
  return;
  
  const a = new Alphapolis();

  test("short-going", async () => {
    const meta = await a.getMetadata("643190032", "456940721");
    eq(meta.onGoing, true);
  });

  test("short-completed", async () => {
    const meta = await a.getMetadata("501580631", "997939367");
    eq(meta.onGoing, false);
  });

  test("long-going", async () => {
    const meta = await a.getMetadata("76166291", "213939438");
    eq(meta.onGoing, true);
  });

  test("long-completed", async () => {
    const meta = await a.getMetadata("77586146", "733940483");
    eq(meta.onGoing, false);
  });





  test("init", async () => {
    return;

    const a = new Alphapolis();

    const meta = await a.getMetadata("501580631", "997939367");
    console.log(meta);

    // const data = await a.getBook(
    //   "292625099",
    //   "906732223",
    //   (err, chapter, index, length) => {
    //     console.log(err, chapter, index, length);
    //   }
    // );
    // console.log(data);

    await a.close();
  });

  test("short", async () => {
    return;

    const a = new Alphapolis();

    // const meta = await a.getMetadata("251592256", "697940638");
    // console.log(meta);

    const data = await a.getBook(
      "251592256",
      "697940638",
      (err, chapter, index, length) => {
        console.log(err, chapter.title, index, length);
      }
    );
    console.log(data);

    await a.close();
  });
});
