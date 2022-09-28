import { request } from "/lib/http-client";
import type {
  SearchPhotosParams,
  UnsplashImageMetadata,
  UnsplashResponseBody,
} from "/lib/unsplash/types";

export function searchPhotos({
  query,
  count,
  start,
}: SearchPhotosParams): UnsplashResponseBody {
  const unsplashPageNumber = Math.floor(start / count);

  const accessKey = app.config.unsplashAccessKey;
  const url = "https://api.unsplash.com/search/photos";
  const response = request({
    url,
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
    params: {
      query,
      page: unsplashPageNumber.toString(),
      per_page: count.toString(),
    },
  });

  if (response.status < 400 && response.body) {
    return JSON.parse(response.body);
  } else {
    throwErrorFromBodyString(response.body);
  }
}

export function getPhotoById(id: string): UnsplashImageMetadata | never {
  const accessKey = app.config.unsplashAccessKey;
  const url = `https://api.unsplash.com/photos/${id}`;
  const response = request({
    url,
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (response.status < 400 && response.body) {
    return JSON.parse(response.body);
  } else {
    throwErrorFromBodyString(response.body);
  }
}

function throwErrorFromBodyString(body: string | null): never {
  const errors =
    JSON.parse(body ?? "{}")?.errors.join() ?? "An error occurred.";
  throw new Error(errors);
}
