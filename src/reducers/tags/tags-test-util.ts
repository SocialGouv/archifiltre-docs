import { Tag } from "./tags-types";

interface TagOptions {
  id: string;
  name?: string;
  ffIds?: string[];
}

const DEFAULT_NAME = "base-tag-name";

/**
 * Utility function for testing purpose that allow to easily create tags
 * @param id
 * @param name
 * @param ffIds
 */
export const createTag = ({ id, name, ffIds }: TagOptions): Tag => ({
  ffIds: ffIds || [],
  id,
  name: name || DEFAULT_NAME,
});
