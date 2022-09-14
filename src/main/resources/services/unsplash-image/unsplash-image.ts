import { request } from "/lib/http-client";

export function get(req: XP.Request): XP.Response {
  const httpResponse = request({
    url: req.params.imageUrl ?? "",
  });

  return {
    body: httpResponse.bodyStream,
    contentType: httpResponse.contentType,
  };
}
