/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { completeDB, excerptsDB } from "./db";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const makeJSONResponse = (data: any) =>
  new Response(JSON.stringify(data), { headers });

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method !== "GET") {
      return new Response(null, {
        status: 405,
      });
    }
    const { pathname } = new URL(request.url);
    if (pathname.includes("person")) {
      const [_, id] = pathname.split("/person/");
      if (!(id in completeDB)) {
        return new Response(null, {
          headers,
          status: 404,
        });
      }
      return makeJSONResponse(completeDB[id]);
    }
    return makeJSONResponse(excerptsDB);
  },
};
