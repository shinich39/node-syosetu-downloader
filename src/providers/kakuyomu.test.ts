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

describe(__path, () => {
  test("init", async () => {
    return;

    const k = new Kakuyomu();

    const meta = await k.getMetadata("16818093077848491501");
    console.log(meta);

    const data = await k.getBook(
      "16818093077848491501",
      (err, chapter, index, length) => {
        console.log(err, chapter, index, length);
      }
    );
    console.log(data);

    await k.close();
  });
});
