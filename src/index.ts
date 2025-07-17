import express from "express";
import { Request, Response } from "express";
import path from "path";
import { getFilePath, getPosts } from "./helpers/post-helpers";
import fs from "fs/promises";
import methodOverride from "method-override";
import { Post } from "./types/posts";

export const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));
app.use(methodOverride("_method"));

app.get("/", async (req: Request, res: Response) => {
  const posts: Post[] = await getPosts();
  res.render("index", { posts });
});

// create post addition endpoint

// create edit endpoint

app.get("/posts/:id", async (req: Request, res: Response) => {
  const posts: Post[] = await getPosts();
  const post = posts.find((post: Post) => post.id === Number(req.params.id));
  res.render("post", { post });
});

app.delete("/posts/:id", async (req: Request, res: Response) => {
  const posts: Post[] = await getPosts();
  const postToRemove = posts.find(
    (post: Post) => post.id === Number(req.params.id)
  );

  if (!postToRemove) {
    return res.status(404).json({ message: "Post not found" });
  }

  const updatedPosts = posts.filter(
    (post: Post) => post.id !== postToRemove.id
  );
  const filePath = getFilePath("../data/posts.json");

  try {
    await fs.writeFile(filePath, JSON.stringify(updatedPosts, null, 2));
    res.redirect("/");
  } catch (err) {
    console.error("Error writing to posts.json:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
