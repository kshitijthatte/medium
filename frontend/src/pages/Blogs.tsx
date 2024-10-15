import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
export const Blogs = () => {
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          <BlogCard
            id={1}
            authorName={"John Doe"}
            title={"Exploring the Unknown: A Journey into the Abyss"}
            content={
              "This article delves into the mysteries of the deep sea, uncovering the fascinating creatures and ecosystems that thrive in the dark. Join us as we explore the depths of the ocean and discover the secrets it holds."
            }
            publishedDate={"2nd Feb 2024"}
          />
        </div>
      </div>
    </div>
  );
};
