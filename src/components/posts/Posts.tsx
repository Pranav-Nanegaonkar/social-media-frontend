import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";

interface PostsProp {
  profileUserid?: number | string | null;
}

const Posts: React.FC<PostsProp> = ({ profileUserid }) => {
  const {
    isPending,
    error,
    data: posts = [],
  } = useQuery({
    queryKey: ["posts", profileUserid || "home"],
    queryFn: async () => {
      const endpoint = profileUserid
        ? `/post?profileUserid=${profileUserid}`
        : "/post";
      const res = await makeRequest.get(endpoint);
      return res.data.data; // Extract just the posts array
    },
    staleTime: 0, // Force refetch every time if you want
  });

  if (isPending) return <p>Loading posts...</p>;
  if (error) return <p>Something went wrong. Please try again.</p>;
  if (!posts.length) return <p>No posts to show.</p>;

  return (
    <div className="posts">
      {posts.map((post: any) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
