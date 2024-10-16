import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={blog.author.name || "Anonymous"}
              title={blog.title}
              content={blog.content}
              publishedDate={String(
                new Date(
                  new Date(2020, 0, 1).getTime() +
                    Math.random() *
                      (new Date().getTime() - new Date(2020, 0, 1).getTime())
                )
              ).slice(4, 15)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
