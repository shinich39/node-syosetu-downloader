import { Provider } from "../models/provider";

export function createURL(
  provider: Provider | string,
  bookId: string,
  chapterId?: string
) {
  let url = "";
  if (provider === "narou") {
    url = `https://ncode.syosetu.com/${bookId}/`;
    if (chapterId && chapterId !== "") {
      url += `${chapterId}`;
    }
  } else if (provider === "narou18") {
    url = `https://novel18.syosetu.com/${bookId}/`;
    if (chapterId) {
      url += `${chapterId}`;
    }
  } else if (provider === "kakuyomu") {
    url = `https://kakuyomu.jp/works/${bookId}`;
    if (chapterId) {
      url += `/episodes/${chapterId}`;
    }
  } else if (provider === "hameln") {
    url = `https://syosetu.org/novel/${bookId}/`;
    if (chapterId) {
      url += `${chapterId}.html`;
    }
  } else if (provider === "alphapolis") {
    url = `https://www.alphapolis.co.jp/novel/${bookId}/`;
    if (chapterId) {
      url += `episode/${chapterId}`;
    }
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
  return url;
}

export function parseURL(str: string) {
  const options: [string, RegExp][] = [
    [
      "narou",
      /^https?:\/\/(?:www\.)?ncode\.syosetu\.com\/(?!novelview)([^/]+)(?:$|\/)/,
    ],
    [
      "narou",
      /^https?:\/\/(?:www\.)?novel18\.syosetu\.com\/(?!novelview)([^/]+)(?:$|\/)/,
    ],
    ["kakuyomu", /^https?:\/\/(?:www\.)?kakuyomu\.jp\/works\/([^/]+)(?:$|\/)/],
    ["hameln", /^https?:\/\/(?:www\.)?syosetu.org\/novel\/([^/]+)(?:$|\/)/],
    [
      "alphapolis",
      /^https?:\/\/(?:www\.)?alphapolis\.co\.jp\/novel\/([^/]+\/[^/]+)(?:$|\/)/,
    ],
  ];

  const parts = str
    .split(/\s/)
    .map((item) => item.trim())
    .filter(Boolean);

  const result: {
    url: string;
    provider: Provider;
    id: string;
  }[] = [];

  for (const part of parts) {
    for (const [provider, re] of options) {
      if (re.test(part)) {
        const match = part.match(re);
        if (!match || !match[0] || !match[1]) {
          continue;
        }

        let url = match[0];

        // fix kakuyomu url
        if (provider === "kakuyomu") {
          url = url.replace(/\/$/, "");
        }

        result.push({
          url: url,
          provider: provider as Provider,
          id: match[1],
        });
      }
    }
  }

  return result;
}
