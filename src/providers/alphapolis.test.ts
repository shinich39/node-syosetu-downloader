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

describe(__path, () => {
  test("init", async () => {
    return;

    const a = new Alphapolis();

    // const meta = await a.getMetadata("292625099", "906732223");
    // console.log(meta);

    const data = await a.getBook(
      "292625099",
      "906732223",
      (err, chapter, index, length) => {
        console.log(err, chapter, index, length);
      }
    );
    console.log(data);

    await a.close();
  });
});
