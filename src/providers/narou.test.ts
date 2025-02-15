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

describe(__path, () => {
  test("init", async () => {
    return;

    const n = new Narou();

    // const meta = await n.getMetadata("n6868jy");
    // console.log(meta);

    const data = await n.getBook("n6868jy", (err, chapter, index, length) => {
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
