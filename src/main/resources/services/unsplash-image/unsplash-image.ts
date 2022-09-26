import { request } from "/lib/http-client";

export function get(req: XP.Request): XP.Response {
  const imageUrl = req.params.imageUrl;

  if (!imageUrl) return { status: 404 };

  const httpResponse = request({
    url: req.params.imageUrl ?? "",
  });

  if (httpResponse.status >= 400) {
    return {
      status: 404,
    };
  }

  return {
    body: httpResponse.bodyStream,
    contentType: httpResponse.contentType,
    status: 200,
  };
}
