import { Post } from "../types/posts";
import { getPosts, writePosts } from "./post-helpers";

let postsCache: Post[] = [];

/**
 * Initialize the posts cache by loading from JSON file
 */
export const initializeCache = async (): Promise<void> => {
  postsCache = await getPosts();
};

/**
 * Get all posts from cache
 */
export const getCachedPosts = (): Post[] => {
  return postsCache;
};

/**
 * Add a new post to cache and persist to file
 */
export const addPostToCache = async (post: Post): Promise<void> => {
  postsCache.unshift(post);
  await writePosts(postsCache);
};

/**
 * Remove a post from cache and persist to file
 */
export const removePostFromCache = async (id: number): Promise<void> => {
  postsCache = postsCache.filter((post) => post.id !== id);
  await writePosts(postsCache);
};

/**
 * Update a post in cache and persist to file
 */
export const updatePostInCache = async (updatedPost: Post): Promise<void> => {
  const index = postsCache.findIndex((post) => post.id === updatedPost.id);
  if (index !== -1) {
    postsCache[index] = updatedPost;
    await writePosts(postsCache);
  }
};
