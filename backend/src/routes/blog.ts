import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();


blogRouter.post("/", async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: "1",
        thumbnail: "",
      },
    });
    return c.json({
      id: blog.id,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while creating the blog",
    });
  }
});

blogRouter.put("/", async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        thumbnail: "",
      },
    });
    return c.json({
      id: blog.id,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while updating the blog",
    });
  }
});

blogRouter.get("/", async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: body.id,
      },
    });
    return c.json({ blog });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blogs",
    });
  }
});

blogRouter.get("/bulk", c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = prisma.blog.findMany();
  return c.json({ blogs });
});
