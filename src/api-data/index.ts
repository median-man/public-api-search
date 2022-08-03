export enum AuthType {
  apiKey = "apiKey",
  unknown = "",
  oAuth = "OAuth",
  mashape = "X-Mashape-Key",
  userAgent = "User-Agent",
}

export enum CorsSupport {
  yes = "yes",
  no = "no",
  unknown = "Unknown",
}

export interface API {
  API: string;
  Auth: AuthType;
  Category: string;
  Cors: CorsSupport;
  Description: string;
  HTTPS: boolean;
  Link: string;
}

export interface APICollection {
  count: number;
  entries: API[];
}

export const apiData: APICollection = require("./apis.json");
