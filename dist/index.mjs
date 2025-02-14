// src/providers/alphapolis.ts
import dayjs from "dayjs";

// src/models/web.ts
import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { CookieJar } from "tough-cookie";
import fetchCookie from "fetch-cookie";

// node_modules/utils-js/dist/index.min.mjs
function C(e2) {
  return typeof e2 == "boolean";
}
function $(e2) {
  return typeof e2 == "number" && !Number.isNaN(e2) && Number.isFinite(e2);
}
function x(e2) {
  return typeof e2 == "string";
}
function p(e2) {
  return typeof e2 == "object" && e2 !== null && !c(e2);
}
function c(e2) {
  return Array && Array.isArray ? Array.isArray(e2) : Object.prototype.toString.call(e2) === "[object Array]";
}
function A(e2) {
  return typeof e2 == "function";
}
function I(e2, t, n) {
  return e2 -= t, n -= t, e2 < 0 && (e2 = e2 % n + n), e2 >= n && (e2 = e2 % n), e2 + t;
}
function je(e2) {
  return e2.replace(/[！-～]/g, function(t) {
    return String.fromCharCode(t.charCodeAt(0) - 65248);
  }).replace(/[^\S\r\n]/g, " ");
}
function B(e2) {
  let t = e2.split("/"), n = t.pop(), r = t.slice(1, t.length).join("/");
  return new RegExp(r, n);
}
function O(e2) {
  let t = {};
  for (let [n, r] of Object.entries(e2)) p(r) ? t[n] = O(r) : c(r) ? t[n] = D(r) : t[n] = r;
  return t;
}
function v(e2, t) {
  function n(o, i) {
    if (p(i)) {
      for (let [u, l] of Object.entries(i)) if (!r(o, l, u.split("."))) return false;
      return true;
    } else return s(o, i, "$eq");
  }
  function r(o, i, u) {
    let l = u.shift();
    return u.length > 0 ? p(o) && x(l) ? r(o[l], i, u) : false : x(l) ? s(o, i, l) : false;
  }
  function s(o, i, u) {
    if (u === "$and") {
      if (!c(i)) throw new Error(`Invalid query type: ${typeof i}`);
      for (let l of i) if (!n(o, l)) return false;
      return true;
    } else {
      if (u === "$nand") return !s(o, i, "$and");
      if (u === "$or") {
        if (!c(i)) throw new Error(`Invalid query type: ${typeof i}`);
        for (let l of i) if (n(o, l)) return true;
        return false;
      } else {
        if (u === "$nor") return !s(o, i, "$or");
        if (u === "$not") return !n(o, i);
        if (u === "$in") {
          if (!c(i)) throw new Error(`Invalid query type: ${typeof i}`);
          for (let l of i) if (s(o, l, "$eq")) return true;
          return false;
        } else {
          if (u === "$nin") return !s(o, i, "$in");
          if (u === "$gt") {
            if (!$(i)) throw new Error(`Invalid query type: ${typeof i}`);
            return o > i;
          } else if (u === "$gte") {
            if (!$(i)) throw new Error(`Invalid query type: ${typeof i}`);
            return o >= i;
          } else if (u === "$lt") {
            if (!$(i)) throw new Error(`Invalid query type: ${typeof i}`);
            return o < i;
          } else if (u === "$lte") {
            if (!$(i)) throw new Error(`Invalid query type: ${typeof i}`);
            return o <= i;
          } else if (u === "$eq") if (c(o) && c(i)) {
            if (o.length !== i.length) return false;
            for (let l in i) if (!s(o[l], i[l], "$eq")) return false;
            return true;
          } else return p(i) ? n(o, i) : o === i;
          else {
            if (u === "$ne") return !s(o, i, "$eq");
            if (u === "$exists") {
              if (!C(i)) throw new Error(`Invalid query type: ${typeof i}`);
              return o != null === i;
            } else if (u === "$elemMatch") {
              if (!p(i)) throw new Error(`Invalid query type: ${typeof i}`);
              if (!c(o)) return false;
              for (let l of o) if (!n(l, i)) return false;
              return true;
            } else if (u === "$mod") {
              if (!c(i)) throw new Error(`Invalid query type: ${typeof i}`);
              let l = i[0], f = i[1];
              if (!$(l)) throw new Error(`Invalid divisor type: ${typeof l}`);
              if (!$(f)) throw new Error(`Invalid remainder type: ${typeof f}`);
              return o % l === f;
            } else {
              if (u === "$size") return c(o) ? n(o.length, i) : p(o) ? n(Object.keys(o).length, i) : false;
              if (u === "$function") {
                if (!A(i)) throw new Error(`Invalid query type: ${typeof i}`);
                return i(o);
              } else if (u === "$regex") {
                if (x(i)) return i.charAt(0) === "/" ? B(i).test(o) : new RegExp(i).test(o);
                if (i instanceof RegExp) return i.test(o);
                throw new Error(`Invalid query type: ${typeof i}`);
              } else if (/^\$-?[0-9]+$/.test(u)) {
                let l = Math.floor(I(parseInt(u.substring(1)), 0, o.length));
                return n(o[l], i);
              } else return p(o) ? p(i) ? n(o[u], i) : s(o[u], i, "$eq") : false;
            }
          }
        }
      }
    }
  }
  return n(e2, t);
}
function P(e2, t) {
  for (let n of Object.keys(t)) for (let [r, s] of Object.entries(t[n])) {
    let o = r.split("."), i = o.pop();
    if (!x(i)) continue;
    let u = e2;
    for (; p(u); ) {
      let l = o.shift();
      if (!l) break;
      u = u[l];
    }
    if (p(u)) {
      if (n === "$set") u[i] = s;
      else if (n === "$unset") s && delete u[i];
      else if (n === "$push") u[i].push(s);
      else if (n === "$pushAll") {
        if (Array.isArray(s)) for (let l of s) u[i].push(l);
      } else if (n === "$pull") {
        for (let l = u[i].length; l >= 0; l--) if (u[i][l] === s) {
          u[i].splice(l, 1);
          break;
        }
      } else if (n === "$pullAll") Array.isArray(s) && (u[i] = u[i].filter(function(l) {
        for (let f of s) if (l === f) return false;
        return true;
      }));
      else if (n === "$addToSet") {
        let l = false;
        for (let f of u[i]) if (f === s) {
          l = true;
          break;
        }
        l || u[i].push(s);
      } else if (n === "$addToSetAll" && Array.isArray(s)) for (let l of s) {
        let f = false;
        for (let d of u[i]) if (d === l) {
          f = true;
          break;
        }
        f || u[i].push(l);
      }
    }
  }
  return e2;
}
function D(e2) {
  let t = [];
  for (let n = 0; n < e2.length; n++) {
    let r = e2[n];
    p(r) ? e2[n] = O(r) : c(r) ? e2[n] = D(r) : e2[n] = r;
  }
  return t;
}
function bt(e2) {
  return new Promise(function(t) {
    return setTimeout(t, e2);
  });
}
var w = [["&", "&amp;"], [" ", "&nbsp;"], ["<", "&lt;"], [">", "&gt;"], ['"', "&quot;"], ["'", "&apos;"], ["\xA2", "&cent;"], ["\xA3", "&pound;"], ["\xA5", "&yen;"], ["\u20AC", "&euro;"], ["\xA9", "&copy;"], ["\xAE", "&reg;"]];
var k = [["<", "&lt;"], [">", "&gt;"], ['"', "&quot;"], ["'", "&apos;"]];
function X(e2) {
  return e2.replace(/\r\n/g, `
`);
}
function W(e2) {
  return e2.replace(/^</, "").replace(/([^<][!?/])?>$/, "").replace(/\s+/g, " ").trim();
}
function q(e2, t) {
  for (let n = e2.length - 1; n >= 0; n--) if (t(e2[n], n, e2)) return n;
  return -1;
}
function T(e2) {
  return encodeURIComponent(e2);
}
function _(e2) {
  return decodeURIComponent(e2);
}
function ee(e2) {
  for (let t = 0; t < w.length; t++) e2 = e2.replace(new RegExp(w[t][0], "g"), w[t][1]);
  return e2;
}
function K(e2) {
  for (let t = w.length - 1; t >= 0; t--) e2 = e2.replace(new RegExp(w[t][1], "g"), w[t][0]);
  return e2;
}
function te(e2) {
  for (let t = 0; t < k.length; t++) e2 = e2.replace(new RegExp(k[t][0], "g"), k[t][1]);
  return e2;
}
function ne(e2) {
  return e2.replace(/<!--([\s\S]*?)-->/g, function(...t) {
    return `<!-->${T(t[1])}</!-->`;
  });
}
function re(e2) {
  return e2.replace(/(<script(?:[\s\S]*?)>)([\s\S]*?)(<\/script>)/g, function(...t) {
    return `${t[1]}${T(t[2])}${t[3]}`;
  });
}
function ie(e2) {
  return e2.replace(/(<style(?:[\s\S]*?)>)([\s\S]*?)(<\/style>)/g, function(...t) {
    return `${t[1]}${T(t[2])}${t[3]}`;
  });
}
function oe(e2) {
  return e2.replace(/(>)([\s\S]*?)(<)/g, function(...t) {
    return `${t[1]}${ee(t[2])}${t[3]}`;
  });
}
function se(e2) {
  function t(...n) {
    return `=${T(n[1])} `;
  }
  return e2.replace(/='([^'>]*?)'/g, t).replace(/="([^">]*?)"/g, t);
}
function ue(e2, t) {
  let n = t.split("="), r = n.shift();
  r && (n.length === 0 ? e2[r] = true : e2[r] = _(n.join("=")));
}
function le(e2) {
  let t = W(e2).split(/\s/), n = { tag: t[0] || "", attributes: {}, children: [], isClosing: false, isClosed: false, isEncoded: false };
  typeof n.tag == "string" && (n.isClosing = /^\//.test(n.tag), n.isClosed = n.isClosing, n.tag = n.tag.replace(/^\//, ""), !n.isClosing && ["script", "style", "!--"].indexOf(n.tag) > -1 && (n.isEncoded = true));
  for (let r = 1; r < t.length; r++) ue(n.attributes, t[r]);
  return n;
}
function fe(e2) {
  let t = "";
  for (let [n, r] of Object.entries(e2)) typeof r == "string" ? t += ` ${n}="${te(r)}"` : r === true && (t += ` ${n}`);
  return t;
}
function L(e2) {
  e2 = se(oe(ie(re(ne(X(e2))))));
  let t = 0, n = /<[^>]*?>/g, r, s = [], o = [], i;
  for (; r = n.exec(e2); ) {
    if (t !== r.index) {
      let u = e2.substring(t, r.index);
      s.push({ content: K(u) });
    }
    if (i = le(r[0]), !i.isClosing) s.push(i), o.push(i);
    else {
      let u = q(s, function(l) {
        return !l.isClosed && l.tag === i.tag;
      });
      if (u > -1) {
        let l = s[u];
        l.isClosed = true, l.children = s.splice(u + 1, s.length - u + 1);
      }
    }
    t = n.lastIndex;
  }
  if (t < e2.length) {
    let u = e2.substring(t);
    s.push({ content: K(u) });
  }
  for (let u of o) {
    if (u.tag && (u.tag.toUpperCase() === "!DOCTYPE" ? u.closer = "" : u.tag.toLowerCase() === "?xml" ? u.closer = "?" : u.tag === "!--" ? u.closer = "--" : u.isClosed || (u.closer = " /"), u.isEncoded && u.children)) for (let l of u.children) l.content && (l.content = _(l.content));
    delete u.isClosed, delete u.isClosing, delete u.isEncoded;
  }
  return { children: s };
}
function V(e2, t) {
  let n = 0, r = function(s) {
    let { tag: o, closer: i, attributes: u, content: l } = t ? t(s, n) : s, f = "";
    if (n++, typeof o == "string") {
      if (f += `<${o}`, typeof u == "object" && (f += fe(u)), typeof i != "string" && (f += ">"), Array.isArray(s.children)) for (let d of s.children) f += r(d);
      typeof i != "string" ? f += `</${o}>` : f += `${i}>`;
    } else if (typeof l == "string") f = l;
    else if (Array.isArray(s.children)) for (let d of s.children) f += r(d);
    return f;
  };
  return r(e2);
}
function Y(e2) {
  let t = function(n) {
    let r = n.split(/([>\s])/).map((i) => i?.trim()).filter(Boolean), s = [], o;
    for (let i of r) {
      if (i === ">") {
        o = i;
        continue;
      }
      let u = o && o === ">" ? 1 : void 0, l = { $and: [] }, f = i.match(/^([a-zA-Z0-9]+)/), d = [...i.matchAll(/#([a-zA-Z0-9_-]+)/g)], m = [...i.matchAll(/\.([a-zA-Z0-9_-]+)/g)], S = [...i.matchAll(/\[([a-zA-Z0-9_-]+)([*^$]?=["']?([^"']+)["']?)?\]/g)];
      if (f) {
        let a = f[1];
        a !== "*" ? l.$and.push({ tag: a }) : l.$and.push({ tag: { $regex: a } });
      }
      if (d.length > 0) for (let a of d) l.$and.push({ "attributes.id": { $regex: "(^| )(" + a[1] + ")( |$)" } });
      if (m.length > 0) for (let a of m) l.$and.push({ "attributes.class": { $regex: "(^| )(" + a[1] + ")( |$)" } });
      if (S.length > 0) for (let a of S) {
        let h = a[1], g = a[2] ? a[2][0] : null, y = a[3], b = {};
        g ? g === "=" ? b["attributes." + h] = y : g === "^" ? b["attributes." + h] = { $regex: `^${y}` } : g === "$" ? b["attributes." + h] = { $regex: `${y}$` } : g === "*" && (b["attributes." + h] = { $regex: y }) : b["attributes." + h] = { $exists: true }, l.$and.push(b);
      }
      u ? s.push({ query: l, depth: u }) : s.push({ query: l }), o = i;
    }
    return s;
  };
  return e2.split(",").map((n) => n.trim()).filter(Boolean).map((n) => t(n));
}
var G = class e {
  constructor(t) {
    this.children = [], typeof t == "string" && (t = L(t)), Object.assign(this, t), this.children = this.prepare(this.children);
  }
  getContent() {
    let t = "";
    if (typeof this.content == "string") t += this.content;
    else for (let n of this.children) t += n.getContent();
    return t;
  }
  setContent(t) {
    return this.children = this.prepare([{ content: t }]), this;
  }
  findOne(t, n = Number.POSITIVE_INFINITY) {
    if (!(n < 1)) for (let r of this.children) {
      if (v(r, t)) return r;
      let s = r.findOne(t, n - 1);
      if (s) return s;
    }
  }
  findMany(t, n = Number.POSITIVE_INFINITY) {
    let r = [];
    if (n < 1) return r;
    for (let s of this.children) {
      v(s, t) && r.push(s);
      let o = s.findMany(t, n - 1);
      r.push(...o);
    }
    return r;
  }
  querySelector(t) {
    let n = Y(t);
    for (let r of n) {
      let s = [this];
      for (let { query: o, depth: i } of r) s = s.reduce((u, l) => [...u, ...l.findMany(o, i)], []);
      if (s[0]) return s[0];
    }
  }
  querySelectorAll(t) {
    let n = Y(t), r = [];
    for (let s of n) {
      let o = [this];
      for (let { query: i, depth: u } of s) o = o.reduce((l, f) => [...l, ...f.findMany(i, u)], []);
      r.push(...o);
    }
    return r = r.filter((s, o, i) => i.findIndex((u) => s == u) === o), r;
  }
  update(t) {
    return P(this, t), this.children = this.prepare(this.children), this;
  }
  updateOne(t, n) {
    let r = this.findOne(t);
    return r && r.update(n), this;
  }
  updateMany(t, n) {
    let r = this.findMany(t);
    for (let s of r) s.update(n);
    return this;
  }
  prepare(t) {
    return t.map((n) => {
      if (n instanceof e) return n.parent = this, n;
      {
        let r = new e(n);
        return r.parent = this, r;
      }
    });
  }
  replace(...t) {
    return this.children = this.prepare(t), this;
  }
  append(...t) {
    return this.children = this.children.concat(this.prepare(t)), this;
  }
  prepend(...t) {
    return this.children.splice(0, 0, ...this.prepare(t)), this;
  }
  insert(t, ...n) {
    return t = Math.floor(I(t, 0, this.children.length)), this.children.splice(t, 0, ...this.prepare(n)), this;
  }
  toObject() {
    let t = O(this);
    return delete t.parent, t.children = this.children.map((n) => n.toObject()), t;
  }
  toString(t) {
    return V(this, t);
  }
  static {
    this.parse = L;
  }
  static {
    this.stringify = V;
  }
};

// src/models/web.ts
puppeteer.use(StealthPlugin());
var cookieJar = new CookieJar();
cookieJar.setCookieSync("over18=yes", "https://novel18.syosetu.com/");
cookieJar.setCookieSync("over18=off", "https://syosetu.org/");
var fetchWithCookies = fetchCookie(fetch, cookieJar);
async function findElement(page, selector, timeout = 0) {
  let i = 0;
  while (i <= timeout) {
    const elem = await page.$(selector);
    if (elem) {
      return elem;
    }
    await bt(256);
    i += 256;
  }
  throw new Error(`Element not found: ${selector}`);
}
async function getContent(page, selector, timeout = 0) {
  const element = await findElement(page, selector, timeout);
  const content = await page.evaluate((elem) => elem?.textContent, element);
  return content;
}
async function clickElement(page, selector, timeout = 0) {
  await findElement(page, selector, timeout);
  await page.click(selector);
}
async function waitContent(page, selector, validator, timeout = 0) {
  let i = 0;
  while (i <= timeout) {
    const content = await getContent(page, selector);
    if (content && validator(content)) {
      return content;
    }
    await bt(256);
    i += 256;
  }
  throw new Error(`Content not found: ${selector}`);
}
var Web = class {
  constructor() {
    this.isOpened = false;
    this.cacheDir = ".puppeteer";
  }
  async open() {
    if (!this.isOpened) {
      this.isOpened = true;
      this.browser = await puppeteer.launch({
        headless: false,
        // args: ["--no-sandbox"],
        userDataDir: this.cacheDir
        // executablePath: "google-chrome-stable",
      });
    }
    while (!this.browser) {
      await bt(128);
    }
  }
  async close() {
    if (this.isOpened) {
      while (!this.browser) {
        await bt(128);
      }
      const b = this.browser;
      this.browser = void 0;
      this.isOpened = false;
      await b.close();
    }
  }
  async load(url, selectors, onLoad) {
    if (!selectors) {
      selectors = [];
    }
    await this.open();
    if (!this.browser) {
      throw new Error("Browser not found");
    }
    const page = await this.browser.newPage();
    try {
      await page.goto(url, this.pageOptions);
      for (const selector of selectors) {
        const timer = setTimeout(() => {
          throw new Error(`Element not found: ${selector}`);
        }, 1e3 * 10);
        await page.waitForSelector(selector, {
          visible: true,
          timeout: 0
        });
        clearTimeout(timer);
      }
      if (onLoad) {
        await onLoad(page);
      }
      const content = await page.content();
      const $2 = cheerio.load(content);
      await page.close();
      return $2;
    } catch (err) {
      await page.close();
      throw err;
    }
  }
  async fetch(url, options) {
    const response = await fetchWithCookies(url, options);
    if (!response.ok) {
      throw new Error("Fetching failed");
    }
    const content = await response.text();
    const $2 = cheerio.load(content);
    return $2;
  }
};

// src/utils/util.ts
function toInt(str) {
  if (typeof str === "number") {
    return str;
  } else if (typeof str === "string") {
    return !isNaN(parseInt(str)) ? parseInt(str) : 0;
  } else {
    return 0;
  }
}
function getText($2) {
  return je($2.find("br").replaceWith("\n").end().text()).trim();
}

// src/providers/alphapolis.ts
var Alphapolis = class extends Web {
  constructor() {
    super();
  }
  async getMetadata(uid, nid) {
    const url = `https://www.alphapolis.co.jp/novel/${uid}/${nid}`;
    const $2 = await this.fetch(url);
    const table = $2("table.detail");
    const getTableText = function(field) {
      return getText(
        table.find("th").filter(function() {
          return $2(this).text().trim() === field;
        }).next()
      );
    };
    const onGoing = /連載中/.test(getText($2(".content-status.complete")));
    const title = getText($2("h1.title"));
    const author = getText($2(".author"));
    const outline = getText($2(".abstract:nth-child(1)"));
    const createdAtStr = getTableText("\u521D\u56DE\u516C\u958B\u65E5\u6642").replace(/[^0-9]/g, "");
    const updatedAtStr = getTableText("\u66F4\u65B0\u65E5\u6642").replace(/[^0-9]/g, "");
    const createdAt = createdAtStr.length === 12 ? dayjs(createdAtStr, "YYYYMMDDHHmm").valueOf() : 0;
    const updatedAt = updatedAtStr.length === 12 ? dayjs(updatedAtStr, "YYYYMMDDHHmm").valueOf() : 0;
    const chapterIds = [];
    for (const elem of $2("div.episode a").toArray()) {
      const href = elem.attribs.href;
      const cid = href.split("/").pop();
      if (!cid) {
        throw new Error(`ChapterID not found: ${href}`);
      }
      chapterIds.push(cid);
    }
    const result = {
      onGoing,
      title,
      outline,
      author,
      chapterIds,
      createdAt,
      updatedAt
    };
    return result;
  }
  async getChapter(uid, nid, cid) {
    const url = `https://www.alphapolis.co.jp/novel/${uid}/${nid}/episode/${cid}`;
    const $2 = await this.load(url, null, async (page) => {
      let i = 0;
      while (i < 10) {
        i++;
        try {
          await clickElement(page, "#TopLayer", 0);
        } catch (err) {
        }
        try {
          await waitContent(
            page,
            "#novelBody",
            (str) => je(str).trim() !== "",
            1e3
          );
          return;
        } catch (err) {
        }
      }
      throw new Error("Content not found");
    });
    const title = getText($2("div.episode-title"));
    const content = $2("#novelBody").find("br").replaceWith("\n").end().text();
    const result = {
      id: cid,
      title,
      content
    };
    return result;
  }
  async getBook(uid, nid, callback) {
    const meta = await this.getMetadata(uid, nid);
    const chapters = [];
    const len = meta.chapterIds.length;
    for (let i = 0; i < len; i++) {
      try {
        const chapterId = meta.chapterIds[i];
        const chapter = await this.getChapter(uid, nid, chapterId);
        chapters.push(chapter);
        if (callback) {
          callback(null, chapter, i, len);
        }
      } catch (err) {
        if (callback) {
          callback(err, null, i, len);
        }
      }
    }
    const result = {
      ...meta,
      chapters
    };
    return result;
  }
};

// src/providers/hameln.ts
import dayjs2 from "dayjs";
var Hameln = class extends Web {
  constructor() {
    super();
  }
  async getMetadata(id) {
    const url = `https://syosetu.org/?mode=ss_detail&nid=${id}`;
    const $2 = await this.fetch(url);
    const getTableText = function(field) {
      return getText(
        $2("td").filter(function() {
          return $2(this).text().trim() === field;
        }).next()
      );
    };
    const onGoing = /短編|完結/.test(getTableText("\u8A71\u6570"));
    const title = getTableText("\u30BF\u30A4\u30C8\u30EB");
    const author = getTableText("\u4F5C\u8005");
    const outline = getTableText("\u3042\u3089\u3059\u3058");
    const chapterCount = parseInt(getTableText("\u8A71\u6570").replace(/[^0-9]/g, ""));
    const createdAtStr = getTableText("\u63B2\u8F09\u958B\u59CB").replace(/[^0-9]/g, "");
    const updatedAtStr = getTableText("\u6700\u65B0\u6295\u7A3F").replace(/[^0-9]/g, "");
    const createdAt = createdAtStr.length === 12 ? dayjs2(createdAtStr, "YYYYMMDDHHmm").valueOf() : 0;
    const updatedAt = updatedAtStr.length === 12 ? dayjs2(updatedAtStr, "YYYYMMDDHHmm").valueOf() : 0;
    const chapterIds = [];
    for (let i = 0; i < chapterCount; i++) {
      chapterIds.push("" + (i + 1));
    }
    const result = {
      onGoing,
      title,
      outline,
      author,
      chapterIds,
      createdAt,
      updatedAt
    };
    return result;
  }
  async getChapter(nid, cid) {
    const url = `https://syosetu.org/novel/${nid}/${cid}.html`;
    const $2 = await this.fetch(url);
    const title = getText($2("#analytics_start").prev());
    let i = 0, elem = $2(`#${i}`);
    const lines = [];
    while (elem.length !== 0) {
      lines.push(elem.text());
      i++;
      elem = $2(`#${i}`);
    }
    const result = {
      id: cid,
      title,
      content: lines.join("\n")
    };
    return result;
  }
  async getBook(id, callback) {
    const meta = await this.getMetadata(id);
    const chapters = [];
    const len = meta.chapterIds.length;
    for (let i = 0; i < len; i++) {
      try {
        const chapterId = meta.chapterIds[i];
        const chapter = await this.getChapter(id, chapterId);
        chapters.push(chapter);
        if (callback) {
          callback(null, chapter, i, len);
        }
      } catch (err) {
        if (callback) {
          callback(err, null, i, len);
        }
      }
    }
    const result = {
      ...meta,
      chapters
    };
    return result;
  }
};

// src/providers/kakuyomu.ts
import dayjs3 from "dayjs";
var Kakuyomu = class extends Web {
  constructor() {
    super();
  }
  async getMetadata(id) {
    const url = `https://kakuyomu.jp/works/${id}`;
    const $2 = await this.fetch(url);
    const title = getText($2("a[title]").first());
    const outline = getText(
      $2(".CollapseTextWithKakuyomuLinks_collapseText__XSlmz")
    );
    const author = getText($2('a[href^="/users"]').first());
    let onGoing = false;
    for (const elem of $2(".Meta_metaItem__8eZTP").toArray()) {
      const text = $2(elem).text();
      if (text.indexOf("\u9023\u8F09\u4E2D") > -1) {
        onGoing = true;
        break;
      } else if (text.indexOf("\u5B8C\u7D50\u6E08") > -1) {
        onGoing = false;
        break;
      }
    }
    let createdAt = 0;
    let updatedAt = 0;
    const chapters = [];
    const nextData = JSON.parse($2("#__NEXT_DATA__").text());
    for (const obj of Object.values(
      nextData.props.pageProps.__APOLLO_STATE__
    )) {
      if (!p(obj)) {
        continue;
      }
      if (obj.__typename === "Episode") {
        const publishedAt = dayjs3(obj.publishedAt).valueOf();
        if (!createdAt) {
          createdAt = publishedAt;
        } else if (createdAt > publishedAt) {
          createdAt = publishedAt;
        }
        if (!updatedAt) {
          updatedAt = publishedAt;
        } else if (updatedAt < publishedAt) {
          updatedAt = publishedAt;
        }
        chapters.push({
          id: obj.id,
          publishedAt
        });
      }
    }
    chapters.sort((a, b) => a.publishedAt - b.publishedAt);
    const result = {
      onGoing,
      title,
      outline,
      author,
      chapterIds: chapters.map((item) => item.id),
      createdAt,
      updatedAt
    };
    return result;
  }
  async getChapter(nid, cid) {
    const url = `https://kakuyomu.jp/works/${nid}/episodes/${cid}`;
    const $2 = await this.fetch(url);
    const title = getText($2("#contentMain-header"));
    let i = 1, elem = $2(`#p${i}`);
    const lines = [];
    while (elem.length !== 0) {
      lines.push(elem.text());
      i++;
      elem = $2(`#p${i}`);
    }
    const result = {
      id: cid,
      title,
      content: lines.join("\n")
    };
    return result;
  }
  async getBook(id, callback) {
    const meta = await this.getMetadata(id);
    const chapters = [];
    const len = meta.chapterIds.length;
    for (let i = 0; i < len; i++) {
      try {
        const chapterId = meta.chapterIds[i];
        const chapter = await this.getChapter(id, chapterId);
        chapters.push(chapter);
        if (callback) {
          callback(null, chapter, i, len);
        }
      } catch (err) {
        if (callback) {
          callback(err, null, i, len);
        }
      }
    }
    const result = {
      ...meta,
      chapters
    };
    return result;
  }
};

// src/providers/narou.ts
import dayjs4 from "dayjs";
var Narou = class extends Web {
  constructor() {
    super();
  }
  async getMetadata(id) {
    const url = `https://ncode.syosetu.com/novelview/infotop/ncode/${id}/`;
    const $2 = await this.fetch(url);
    const onGoing = getText($2("#noveltype_not")) !== "\u5B8C\u7D50\u6E08";
    const title = getText($2("#contents_main > h1 > a"));
    const author = getText($2("#noveltable1 tbody tr:nth-child(2) td"));
    const outline = getText($2("#noveltable1 tbody tr:nth-child(1) td"));
    const createdAtStr = getText(
      $2("#noveltable2 tbody tr:nth-child(1) td")
    ).replace(/[^0-9]/g, "");
    const updatedAtStr = getText(
      $2("#noveltable2 tbody tr:nth-child(2) td")
    ).replace(/[^0-9]/g, "");
    const createdAt = createdAtStr.length === 12 ? dayjs4(createdAtStr, "YYYYMMDDHHmm").valueOf() : 0;
    const updatedAt = updatedAtStr.length === 12 ? dayjs4(updatedAtStr, "YYYYMMDDHHmm").valueOf() : 0;
    const chapterCount = toInt(
      je($2("#pre_info").text()).match(/全([0-9]+)エピソード/)?.[1] || ""
    );
    const chapterIds = [];
    for (let i = 0; i < chapterCount; i++) {
      chapterIds.push("" + (i + 1));
    }
    const result = {
      onGoing,
      title,
      outline,
      author,
      chapterIds,
      createdAt,
      updatedAt
    };
    return result;
  }
  async getChapter(nid, cid) {
    const url = `https://ncode.syosetu.com/${nid}/${cid}`;
    const $2 = await this.fetch(url);
    const title = getText($2("h1.p-novel__title p-novel__title--rensai"));
    let i = 1, elem = $2(`#L${i}`);
    const lines = [];
    while (elem.length !== 0) {
      lines.push(elem.text());
      i++;
      elem = $2(`#L${i}`);
    }
    const result = {
      id: cid,
      title,
      content: lines.join("\n")
    };
    return result;
  }
  async getBook(id, callback) {
    const meta = await this.getMetadata(id);
    const chapters = [];
    const len = meta.chapterIds.length;
    for (let i = 0; i < len; i++) {
      try {
        const chapterId = meta.chapterIds[i];
        const chapter = await this.getChapter(id, chapterId);
        chapters.push(chapter);
        if (callback) {
          callback(null, chapter, i, len);
        }
      } catch (err) {
        if (callback) {
          callback(err, null, i, len);
        }
      }
    }
    const result = {
      ...meta,
      chapters
    };
    return result;
  }
};

// src/models/provider.ts
var PROVIDER = {
  NAROU: "narou",
  KAKUYOMU: "kakuyomu",
  ALPHAPOLIS: "alphapolis",
  HAMELN: "hameln"
};

// src/index.ts
async function getMetadata(provider, bookId) {
  if (provider === "narou") {
    const w2 = new Narou();
    const data = await w2.getMetadata(bookId);
    return data;
  } else if (provider === "kakuyomu") {
    const w2 = new Kakuyomu();
    const data = await w2.getMetadata(bookId);
    return data;
  } else if (provider === "alphapolis") {
    const w2 = new Alphapolis();
    const data = await w2.getMetadata(
      bookId.split("/")[0],
      bookId.split("/")[1]
    );
    return data;
  } else if (provider === "hameln") {
    const w2 = new Hameln();
    const data = await w2.getMetadata(bookId);
    return data;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}
async function getChapter(provider, bookId, chapterId) {
  if (provider === "narou") {
    const w2 = new Narou();
    const data = await w2.getChapter(bookId, chapterId);
    return data;
  } else if (provider === "kakuyomu") {
    const w2 = new Kakuyomu();
    const data = await w2.getChapter(bookId, chapterId);
    return data;
  } else if (provider === "alphapolis") {
    const w2 = new Alphapolis();
    const data = await w2.getChapter(
      bookId.split("/")[0],
      bookId.split("/")[1],
      chapterId
    );
    await w2.close();
    return data;
  } else if (provider === "hameln") {
    const w2 = new Hameln();
    const data = await w2.getChapter(bookId, chapterId);
    return data;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}
async function getBook(provider, bookId, callback) {
  if (provider === "narou") {
    const w2 = new Narou();
    const data = await w2.getBook(bookId, callback);
    return data;
  } else if (provider === "kakuyomu") {
    const w2 = new Kakuyomu();
    const data = await w2.getBook(bookId, callback);
    return data;
  } else if (provider === "alphapolis") {
    const w2 = new Alphapolis();
    const data = await w2.getBook(
      bookId.split("/")[0],
      bookId.split("/")[1],
      callback
    );
    await w2.close();
    return data;
  } else if (provider === "hameln") {
    const w2 = new Hameln();
    const data = await w2.getBook(bookId, callback);
    return data;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}
export {
  PROVIDER,
  getBook,
  getChapter,
  getMetadata
};
