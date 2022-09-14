import { getSiteConfig } from "/lib/xp/portal";
import { request } from "/lib/http-client";

interface SearchPhotosParams {
  query: string;
  start: number;
  count: number;
}

export interface UnsplashSearchResults {
  id: string;
  description: string;
  alt_description: string;
  user: {
    name: string;
  };
  urls: {
    thumb: string;
  };
}

interface UnsplashResponseBody {
  total: number;
  total_pages: number;
  results: UnsplashSearchResults[];
}

export function searchPhotos({
  query,
  count,
  start,
}: SearchPhotosParams): UnsplashResponseBody {
  const unsplashPageNumber = Math.floor(start / count);

  const accessKey = getSiteConfig().unsplashAccessKey;
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

  if (response.status < 400) {
    return JSON.parse(response.body || "");
  } else {
    const errors = JSON.parse(response.body ?? "")?.errors.join();
    throw new Error(errors);
  }
}

export function getPhotoById(id: string) {
 const accessKey = getSiteConfig().unsplashAccessKey;
 const url = `https://api.unsplash.com/photos/${id}`;
  const response = request({
    url,
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (response.status < 400) {
    return JSON.parse(response.body || "");
  } else {
    const errors = JSON.parse(response.body ?? "")?.errors.join();
    throw new Error(errors);
  }
}
