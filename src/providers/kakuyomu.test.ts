// @ts-nocheck

import { describe, test, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Kakuyomu } from "./kakuyomu";
const __path = path.relative(process.cwd(), fileURLToPath(import.meta.url));
const eq = (a, b, msg) =>
  typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);

// Going: https://kakuyomu.jp/works/16818093093040916427
// Completed: https://kakuyomu.jp/works/16818093094170635844

describe(__path, () => {
  return;
  
  const a = new Kakuyomu();

  test("going", async () => {
    const meta = await a.getMetadata("16818093093040916427");
    eq(meta.onGoing, true);
  });

  test("completed", async () => {
    const meta = await a.getMetadata("16818093094170635844");
    eq(meta.onGoing, false);
  });
  
  test("init", async () => {
    return;


    const meta = await k.getMetadata("16818093094170635844");
    console.log(meta);

    // const data = await k.getBook(
    //   "16818093077848491501",
    //   (err, chapter, index, length) => {
    //     console.log(err, chapter, index, length);
    //   }
    // );
    // console.log(data);

    await k.close();
  });
});
