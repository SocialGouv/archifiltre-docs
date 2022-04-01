import type { Tag } from "@renderer/reducers/tags/tags-types";

interface TagOptions {
  ffIds?: string[];
  id: string;
  name?: string;
}

const DEFAULT_NAME = "base-tag-name";

/**
 * Utility function for testing purpose that allow to easily create tags
 * @param id
 * @param name
 * @param ffIds
 */
export const createTag = ({ id, name, ffIds }: TagOptions): Tag => ({
  ffIds: ffIds ?? [],
  id,
  name: name ?? DEFAULT_NAME,
});
