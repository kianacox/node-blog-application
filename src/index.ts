import express, { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import { generateId } from "./helpers/post-helpers";
import { Post } from "./types/posts";
import {
  initializeCache,
  getCachedPosts,
  addPostToCache,
  removePostFromCache,
} from "./helpers/posts-cache";

export const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  const posts: Post[] = getCachedPosts();
  res.render("index", { posts });
});

app.post("/posts/create-post", async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const errors: string[] = [];

  if (!title || title.trim() === "") {
    errors.push("Title is required");
  }
  if (!content || content.trim() === "") {
    errors.push("Content is required");
  }

  if (errors.length > 0) {
    const posts: Post[] = getCachedPosts();
    return res.render("index", {
      posts,
      errors,
      formData: { title, content },
    });
  }

  const posts: Post[] = getCachedPosts();
  let newPost: Post = {
    id: generateId(),
    title: title.trim(),
    content: content.trim(),
  };

  if (posts.some((post: Post) => post.id === newPost.id)) {
    while (posts.some((post: Post) => post.id === newPost.id)) {
      newPost.id = generateId();
    }
  }

  await addPostToCache(newPost);

  res.redirect("/");
});

// create edit endpoint

app.get("/posts/:id", async (req: Request, res: Response) => {
  const posts: Post[] = getCachedPosts();
  const post = posts.find((post: Post) => post.id === Number(req.params.id));
  res.render("post", { post });
});

app.delete("/posts/:id", async (req: Request, res: Response) => {
  const posts: Post[] = getCachedPosts();
  const postToRemove = posts.find(
    (post: Post) => post.id === Number(req.params.id)
  );

  if (!postToRemove) {
    return res.status(404).json({ message: "Post not found" });
  }

  await removePostFromCache(postToRemove.id);

  res.redirect("/");
});

app.listen(port, async () => {
  await initializeCache();
  console.log(`Server is running at http://localhost:${port}`);
});
