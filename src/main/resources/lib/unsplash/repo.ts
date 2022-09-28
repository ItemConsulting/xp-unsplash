import { get as getRepo, create as createRepo } from "/lib/xp/repo";
import { connect, NodeQueryHit, RepoConnection } from "/lib/xp/node";
import { forceArray } from "/lib/unsplash/utils";
import { UnsplashContent, UnsplashImageMetadata } from "/lib/unsplash/types";

const repoId = "no.item.unsplash";

export function lookUpImageMetadata(
  unsplashIds: string | Array<string>
): UnsplashImageMetadata[] {
  ensureRepoExists(repoId);
  const connection = connect({ repoId, branch: "master" });
  return getNodeByDataId(connection, unsplashIds).map((hit) => {
    return connection.get<UnsplashContent>(hit.id).data;
  });
}

export function storeImageMetadata(imageMetadata: UnsplashImageMetadata): void {
  const connection = connect({ repoId, branch: "master" });
  connection.create<UnsplashContent>({
    _name: imageMetadata.id,
    data: imageMetadata,
  });
}

function ensureRepoExists(repoId: string): void {
  const repo = getRepo(repoId);
  if (!repo) {
    createRepo({ id: repoId });
  }
}

function getNodeByDataId(
  connection: RepoConnection,
  ids: string | Array<string>
): ReadonlyArray<NodeQueryHit> {
  const values = forceArray(ids);

  return connection.query({
    count: values.length,
    filters: {
      boolean: {
        must: {
          hasValue: {
            values,
            field: "_name",
          },
        },
        mustNot: {
          ids: {
            values: ["000-000-000-000"],
          },
        },
      },
    },
  }).hits;
}
