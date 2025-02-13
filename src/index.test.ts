// @ts-nocheck

import { describe, test, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getBook, getChapter, getMetadata } from "./index";
const __path = path.relative(process.cwd(), fileURLToPath(import.meta.url));
const eq = (a, b, msg) =>
  typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);

describe(__path, () => {
  test("getMetadata", async () => {
    return;

    // 18
    const data = await getMetadata("narou", "n2610gb");

    console.log(data);
  });

  test("getChapter", async () => {
    // 18
    const data = await getChapter("narou", "n2610gb", "1");

    console.log(data);
  });

  test("getBook", async () => {
    return;

    // 18
    const data = await getBook(
      "narou",
      "n2610gb",
      (err, chapter, index, length) => {
        if (err) {
          console.error(err);
        } else {
          console.log(chapter);
        }
      }
    );
  });
});
