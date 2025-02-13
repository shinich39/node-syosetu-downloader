import { Cheerio, CheerioAPI } from "cheerio";
import { getContainedNumber, toHalfWidth } from "utils-js";

export function toInt(str: any) {
  if (typeof str === "number") {
    return str;
  } else if (typeof str === "string") {
    return !isNaN(parseInt(str)) ? parseInt(str) : 0;
  } else {
    return 0;
  }
}

export function toFloat(str: any) {
  if (typeof str === "number") {
    return str;
  } else if (typeof str === "string") {
    return !isNaN(parseFloat(str)) ? parseFloat(str) : 0;
  } else {
    return 0;
  }
}

export function getText($: Cheerio<any>) {
  return toHalfWidth($.find("br").replaceWith("\n").end().text()).trim();
}

export function getInt($: Cheerio<any>) {
  return toInt(getText($).replace(/[^0-9]/g, ""));
}

export function getFloat($: Cheerio<any>) {
  return toFloat(getText($).replace(/[^0-9.]/g, ""));
}
