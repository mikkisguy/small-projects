// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Welcome {
  teletext: Teletext;
}

export interface Teletext {
  network: string;
  xml: string;
  page: Page;
}

export interface Page {
  number: string;
  name: string;
  subpagecount: string;
  prevpg: string;
  nextpg: string;
  toptype: string;
  time: Date;
  subpage: Subpage[];
}

export interface Subpage {
  number: string;
  time: string;
  content: Content[];
}

export interface Content {
  type: string;
  line: Line[];
}

export interface Line {
  number: string;
  Text?: string;
  run?: RunElement[] | PurpleRun;
}

export interface RunElement {
  bg: Bg;
  fg: Fg;
  length: string;
  charcode?: string;
  Text?: string;
  link?: string;
}

export enum Bg {
  Black = "black",
  Blue = "blue",
}

export enum Fg {
  Blue = "blue",
  Cyan = "cyan",
  Gcyan = "gcyan",
  Gwhite = "gwhite",
  White = "white",
}

export interface PurpleRun {
  bg: Bg;
  fg: Fg;
  length: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWelcome(json: string): Welcome {
    return cast(JSON.parse(json), r("Welcome"));
  }

  public static welcomeToJson(value: Welcome): string {
    return JSON.stringify(uncast(value, r("Welcome")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val
    )}`
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = ""
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Welcome: o([{ json: "teletext", js: "teletext", typ: r("Teletext") }], false),
  Teletext: o(
    [
      { json: "network", js: "network", typ: "" },
      { json: "xml", js: "xml", typ: "" },
      { json: "page", js: "page", typ: r("Page") },
    ],
    false
  ),
  Page: o(
    [
      { json: "number", js: "number", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "subpagecount", js: "subpagecount", typ: "" },
      { json: "prevpg", js: "prevpg", typ: "" },
      { json: "nextpg", js: "nextpg", typ: "" },
      { json: "toptype", js: "toptype", typ: "" },
      { json: "time", js: "time", typ: Date },
      { json: "subpage", js: "subpage", typ: a(r("Subpage")) },
    ],
    false
  ),
  Subpage: o(
    [
      { json: "number", js: "number", typ: "" },
      { json: "time", js: "time", typ: "" },
      { json: "content", js: "content", typ: a(r("Content")) },
    ],
    false
  ),
  Content: o(
    [
      { json: "type", js: "type", typ: "" },
      { json: "line", js: "line", typ: a(r("Line")) },
    ],
    false
  ),
  Line: o(
    [
      { json: "number", js: "number", typ: "" },
      { json: "Text", js: "Text", typ: u(undefined, "") },
      {
        json: "run",
        js: "run",
        typ: u(undefined, u(a(r("RunElement")), r("PurpleRun"))),
      },
    ],
    false
  ),
  RunElement: o(
    [
      { json: "bg", js: "bg", typ: r("Bg") },
      { json: "fg", js: "fg", typ: r("Fg") },
      { json: "length", js: "length", typ: "" },
      { json: "charcode", js: "charcode", typ: u(undefined, "") },
      { json: "Text", js: "Text", typ: u(undefined, "") },
      { json: "link", js: "link", typ: u(undefined, "") },
    ],
    false
  ),
  PurpleRun: o(
    [
      { json: "bg", js: "bg", typ: r("Bg") },
      { json: "fg", js: "fg", typ: r("Fg") },
      { json: "length", js: "length", typ: "" },
    ],
    false
  ),
  Bg: ["black", "blue"],
  Fg: ["blue", "cyan", "gcyan", "gwhite", "white"],
};
