import type {
  UnsplashImageMetadata,
  UnsplashImageUrlParams,
} from "/lib/unsplash/types";
import { lookUpImageMetadata, storeImageMetadata } from "/lib/unsplash/repo";
import { getPhotoById } from "/lib/unsplash/client";
import { serviceUrl } from "/lib/xp/portal";
import { notEmpty } from "/lib/unsplash/utils";
export { searchPhotos } from "/lib/unsplash/client";

export function getUnsplashImagesMetadata(
  unsplashIds: string[]
): UnsplashImageMetadata[] {
  return unsplashIds.map(getUnsplashImageMetadata).filter(notEmpty);
}

export function getUnsplashImageUrl(
  unsplashId: string,
  width: number,
  height: number
) {
  const rawImageUrl = getUnsplashImageMetadata(unsplashId)?.urls.raw;
  const adjustedImageUrl = rawImageUrl
    ? createImageUrl(rawImageUrl, {
        width,
        height,
      })
    : undefined;
  return serviceUrl({
    service: "unsplash-image",
    params: { adjustedImageUrl },
  });
}

function getUnsplashImageMetadata(
  unsplashId: string
): UnsplashImageMetadata | null {
  const storedUnsplashImageMetadata = lookUpImageMetadata(unsplashId)[0];
  if (storedUnsplashImageMetadata) {
    return storedUnsplashImageMetadata;
  }
  try {
    const unsplashImageMetadata = getPhotoById(unsplashId);
    storeImageMetadata(unsplashImageMetadata);
    return unsplashImageMetadata;
  } catch (e) {
    log.error(`Could not fetch image with id ${unsplashId}`, e);
    return null;
  }
}

function createImageUrl(raw: string, params: UnsplashImageUrlParams): string {
  const { width, height } = params;
  return `${raw}&fm=jpg${width ? `&w=${width}` : ""}${
    height ? `&h=${height}` : ""
  }`;
}
