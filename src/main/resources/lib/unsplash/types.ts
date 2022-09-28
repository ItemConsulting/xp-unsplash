export interface UnsplashImageMetadata {
  id: string;
  description: string;
  alt_description: string;
  user: {
    name: string;
  };
  urls: {
    thumb: string;
    raw: string;
  };
}

export interface SearchPhotosParams {
  query: string;
  start: number;
  count: number;
}

export interface UnsplashResponseBody {
  total: number;
  total_pages: number;
  results: UnsplashImageMetadata[];
}

export interface UnsplashContent {
  data: UnsplashImageMetadata;
}

export interface UnsplashImageUrlParams {
  width?: number;
  height?: number;
}
