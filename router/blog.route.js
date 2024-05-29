import { Router } from "express";

import { createBlog, retireveBlogs, retrievingSingleBlog } from "../controller/blog.controller.js";

const blogRouter = Router();

blogRouter.post("/", createBlog);
blogRouter.get("/", retireveBlogs);
blogRouter.get("/:id", retrievingSingleBlog);

export default blogRouter;
