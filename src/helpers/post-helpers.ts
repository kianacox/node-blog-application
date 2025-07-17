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
