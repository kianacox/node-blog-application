import express, { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import { findPostById, generateId } from "./helpers/post-helpers";
import { Post } from "./types/posts";
import {
  initializeCache,
  getCachedPosts,
  addPostToCache,
  removePostFromCache,
  updatePostInCache,
} from "./helpers/posts-cache";

export const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @description Get all posts
 * @route GET /
 * @returns {Promise<void>}
 */
app.get("/", async (req: Request, res: Response) => {
  const posts: Post[] = getCachedPosts();
  res.render("index", { posts });
});

/**
 * @description Get a post by id to edit
 * @route GET /posts/:id
 * @returns {Promise<void>}
 */
app.get("/posts/:id/edit", async (req: Request, res: Response) => {
  const post = await findPostById(Number(req.params.id));
  res.render("edit", { post });
});

/**
 * @description Get a post by id to view
 * @route GET /posts/:id
 * @returns {Promise<void>}
 */
app.get("/posts/:id", async (req: Request, res: Response) => {
  const post = await findPostById(Number(req.params.id));
  res.render("post", { post });
});

/**
 * @description Create a new post
 * @route POST /posts/create-post
 * @returns {Promise<void>}
 */
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

/**
 * @description Update a post
 * @route PATCH /posts/:id
 * @returns {Promise<void>}
 */
app.patch("/posts/:id", async (req: Request, res: Response) => {
  const { title = "", content = "" } = req.body;
  const postToUpdate = await findPostById(Number(req.params.id));
  const errors: string[] = [];

  if (!postToUpdate) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!title.trim()) errors.push("Title is required");
  if (!content.trim()) errors.push("Content is required");

  if (errors.length > 0) {
    return res.render("edit", {
      post: { ...postToUpdate, title, content },
      errors,
    });
  }

  postToUpdate.title = title.trim();
  postToUpdate.content = content.trim();

  await updatePostInCache(postToUpdate);

  res.redirect("/");
});

/**
 * @description Delete a post
 * @route DELETE /posts/:id
 * @returns {Promise<void>}
 */
app.delete("/posts/:id", async (req: Request, res: Response) => {
  const postToRemove = await findPostById(Number(req.params.id));

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
