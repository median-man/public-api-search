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
  Auth: string;
  Category: string;
  Cors: string;
  Description: string;
  HTTPS: boolean;
  Link: string;
}

export interface APICollection {
  count: number;
  entries: API[];
}

export { default as apiData } from "./apis.json";
