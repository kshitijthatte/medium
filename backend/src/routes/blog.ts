import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization") || "";

  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }
  const token = jwt.split(" ")[1];

  const payload = (await verify(token, c.env.JWT_SECRET)) as any;
  if (payload) {
    c.set("userId", payload.id || "");
    await next();
  } else {
    c.status(401);
    return c.json({
      message: "You are not logged in",
    });
  }
});

blogRouter.post("/", async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const authorId = c.get("userId");
  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
        thumbnail: body.thumbnail,
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
        authorId: c.get("userId"),
      },
      data: {
        title: body.title,
        content: body.content,
        thumbnail: body.thumbnail,
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

blogRouter.get("/bulk", async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.blog.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      thumbnail: true,
      author: {
        select: {
          name: true
        }
      }
    },
  });
  return c.json({ blogs });
});

blogRouter.get("/:id", async c => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = await c.req.param("id");
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
      select: {
        content: true,
        title: true,
        id: true,
        thumbnail: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });
    return c.json({ blog });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blogs",
    });
  }
});