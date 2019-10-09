import { StoreState } from "./store";

/**
 * Create an empty store state for testing purposes
 */
export const createEmptyStore = (): StoreState => ({
  filesAndFolders: {
    current: {
      filesAndFolders: {}
    },
    future: [],
    past: [],
    present: {
      filesAndFolders: {}
    }
  },
  tags: {
    current: {
      tags: {}
    },
    future: [],
    past: [],
    present: {
      tags: {}
    }
  }
});
