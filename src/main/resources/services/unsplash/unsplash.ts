import { serviceUrl } from "/lib/xp/portal";
import {
  getPhotoById,
  searchPhotos,
  UnsplashSearchResults,
} from "/lib/unsplash";

export function get(
  req: XP.CustomSelectorServiceRequest
): XP.CustomSelectorServiceResponse {
  const start = parseInt(req.params.start ?? "0");
  const count = parseInt(req.params.count ?? "10");

  if (req.params.ids) {
    const photoIds = req.params.ids.split(",");
    const photos = photoIds.map(getPhotoById);
    return {
      body: {
        count,
        total: photos.length,
        hits: photos.map(unsplashResultToCustomSelectorHit),
      },
    };
  } else if (!req.params.query) {
    return {
      body: {
        count: 0,
        total: 0,
        hits: [],
      },
    };
  }

  const unsplashResponse = searchPhotos({
    count,
    start,
    query: req.params.query,
  });

  return {
    body: {
      count,
      total: unsplashResponse.total,
      hits: unsplashResponse.results.map(unsplashResultToCustomSelectorHit),
    },
  };
}

function unsplashResultToCustomSelectorHit(
  result: UnsplashSearchResults
): XP.CustomSelectorServiceResponseHit {
  return {
    id: result.id,
    displayName: result.alt_description ?? result.description ?? "[NO_NAME]",
    iconUrl: serviceUrl({
      service: "unsplash-image",
      params: { imageUrl: result.urls.thumb },
    }),
    description: result.user.name,
  };
}
