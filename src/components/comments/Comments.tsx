import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../utils/axios";
import moment from "moment";

interface commentProps {
  postId: number;
}

const Comments: React.FC<commentProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const [inputField, setInputField] = useState("");

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await makeRequest.get(`/comment/${postId}`);
      return res.data?.data || [];
    },
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: async (newComment: { desc: string; postid: number }) => {
      const res = await makeRequest.post("/comment", newComment);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setInputField("");
    },
  });

  console.log(data);

  const handleButton = () => {
    if (!inputField.trim()) return;
    mutation.mutate({ desc: inputField, postid: postId });
  };

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            currentUser?.profilePic
              ? currentUser.profilePic
              : "/uploads/boy.png"
          }
          alt="user"
        />
        <input
          type="text"
          value={inputField}
          placeholder="Write a comment..."
          onChange={(e) => setInputField(e.target.value)}
        />
        <button onClick={handleButton}>Send</button>
      </div>

      {error
        ? "Something went wrong"
        : isPending
        ? "Loading..."
        : data.map((comment: any) => (
            <div className="comment" key={comment.id}>
              <img
                src={
                  comment?.users?.profilePic
                    ? comment?.users?.profilePic
                    : "/uploads/boy.png"
                }
                alt="comment"
              />
              <div className="info">
                <span>{comment?.users?.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
