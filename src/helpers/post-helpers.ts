import path from "path";
import fs from "fs/promises";
import { Post } from "../types/posts";

export const getFilePath = (fileName: string): string => {
  return path.join(__dirname, fileName);
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const filePath = getFilePath("../data/posts.json");
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading posts.json:", err);
    return [];
  }
};

export const writePosts = async (posts: Post[]): Promise<void> => {
  try {
    const filePath = getFilePath("../data/posts.json");
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error("Error writing to posts.json:", err);
  }
};

export const generateId = (): number => {
  return Math.floor(Math.random() * 1000000);
};
