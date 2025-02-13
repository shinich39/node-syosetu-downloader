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

describe(__path, () => {
  test("init", async () => {
    return;

    const h = new Hameln();

    const meta = await h.getMetadata("299060");
    console.log(meta);

    const data = await h.getBook("299060", (err, chapter, index, length) => {
      console.log(err, chapter, index, length);
    });
    console.log(data);

    await h.close();
  });

  test("18", async () => {
    return;

    const h = new Hameln();

    const meta = await h.getMetadata("365043");
    console.log(meta);

    const data = await h.getBook("365043", (err, chapter, index, length) => {
      console.log(err, chapter, index, length);
    });
    console.log(data);

    await h.close();
  });
});
