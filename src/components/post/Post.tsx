import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import Comments from "../comments/Comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../utils/axios";
import { AuthContext } from "../../context/authContext";
import moment from "moment";

interface PostProps {
  post: any;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 🔹 NEW state
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Likes Query
  const { isPending: loadingLikes, data: likes = [] } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/like?postid=${post.id}`);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Comments Query
  const { isPending: loadingComments, data: comments = [] } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/comment/${post.id}`);
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Like/Unlike Mutation
  const likeMutation = useMutation({
    mutationFn: async (liked: boolean) => {
      if (liked) {
        return await makeRequest.delete(`/like?postid=${post.id}`);
      }
      return await makeRequest.post(`/like?postid=${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
    },
  });

  // 🔹 Delete Post Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await makeRequest.delete(`/post/${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // refresh post feed
      setMenuOpen(false);
    },
  });

  // Like Handler
  const handleLike = () => {
    likeMutation.mutate(likes.includes(currentUser?.id));
  };

  // 🔹 Delete Handler
  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post?.users?.profilePic
                  ? post.users.profilePic
                  : "/uploads/boy.png"
              }
              alt={post?.users?.name}
            />
            <div className="details">
              <Link
                to={`/profile/${post?.users?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post?.users?.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>

          {/* 🔹 Dropdown toggle */}
          <div className="menuWrapper">
            <MoreHorizIcon
              className="menuIcon"
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            {menuOpen && (
              <div className="dropdown">
                {post.users?.id === currentUser?.id && (
                  <button
                    className="deleteBtn"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete Post"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="content">
          <p>{post.desc}</p>
          {post.img && <img src={post.img} alt="Post" />}
        </div>

        <div className="info">
          <div className="item">
            {loadingLikes ? (
              "loading"
            ) : likes.includes(currentUser?.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {likes.length}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {loadingComments ? "" : comments.length} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
