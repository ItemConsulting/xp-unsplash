import { serviceUrl } from "/lib/xp/portal";
import type { UnsplashImageMetadata } from "/lib/unsplash/types";
import { getUnsplashImagesMetadata, searchPhotos } from "/lib/unsplash";

export function get(
  req: XP.CustomSelectorServiceRequest
): XP.CustomSelectorServiceResponse {
  const start = parseInt(req.params.start ?? "0") + 1;
  const count = parseInt(req.params.count ?? "10");

  if (req.params.ids) {
    const photoIds = req.params.ids.split(",");
    const imagesMetadata = getUnsplashImagesMetadata(photoIds);
    return {
      body: {
        count,
        total: imagesMetadata.length,
        hits: imagesMetadata.map(unsplashImageMetadataToCustomSelectorHit),
      },
    };
  }

  const unsplashResponse = searchPhotos({
    count,
    start,
    query: req.params.query ?? "",
  });

  return {
    body: {
      count,
      total: unsplashResponse.total,
      hits: unsplashResponse.results.map(
        unsplashImageMetadataToCustomSelectorHit
      ),
    },
  };
}

function unsplashImageMetadataToCustomSelectorHit(
  imageMetadata: UnsplashImageMetadata
): XP.CustomSelectorServiceResponseHit {
  return {
    id: imageMetadata.id,
    displayName:
      imageMetadata.alt_description ?? imageMetadata.description ?? "[NO_NAME]",
    iconUrl: serviceUrl({
      service: "unsplash-image",
      params: { imageUrl: imageMetadata.urls.thumb },
    }),
    description: imageMetadata.user.name,
  };
}
