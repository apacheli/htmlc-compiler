import { dirname, join } from "https://deno.land/std@0.218.2/path/mod.ts";

export const getAttrs = (s) => {
  const re = /(?:(\w+)=)((".+?")|\S+)/g;
  const dict = {};
  for (const k of s.matchAll(re)) {
    dict[k[1]] = k[3]?.slice(1, -1) ?? k[2];
  }
  return dict;
};

export const compile = async (path, hrefs = {}, code) => {
  let s = code ?? await Deno.readTextFile(path);
  const re = /<component\s+(.+?)\s*(?:\/>|>([\s\S]*)<\/component>)/g;
  for (const match of s.matchAll(re)) {
    const attrs = getAttrs(match[1]);
    attrs.children = match[2] && await compile(path, hrefs, match[2]);
    const p = join(dirname(path), attrs.href);
    if (hrefs[p] === null) {
      throw new Error("A recursion occurred.");
    }
    if (!hrefs[p]) {
      hrefs[p] = null;
      hrefs[p] = await compile(p, hrefs);
    }
    s = s.replace(match[0], hrefs[p]);
    for (const key in attrs) {
      s = s.replace(new RegExp(`{\\s*${key}\\s*}`, "g"), attrs[key]);
    }
  }
  return s;
};

if (import.meta.main) {
  const output = await compile(Deno.args[0]);
  console.log(output);
}
