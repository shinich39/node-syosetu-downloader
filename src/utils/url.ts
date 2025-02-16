import { Provider } from "../models/provider";

export function createURL(provider: Provider | string, id: string) {
  if (provider === "narou") {
    return `https://ncode.syosetu.com/${id}/`;
  } else if (provider === "narou18") {
    return `https://novel18.syosetu.com/${id}/`;
  } else if (provider === "kakuyomu") {
    return `https://kakuyomu.jp/works/${id}`;
  } else if (provider === "hameln") {
    return `https://syosetu.org/novel/${id}/`;
  } else if (provider === "alphapolis") {
    return `https://www.alphapolis.co.jp/novel/${id}/`;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
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
          provider: provider as Provider,
          id: match[1],
          url: url,
        });
      }
    }
  }

  return result;
}
