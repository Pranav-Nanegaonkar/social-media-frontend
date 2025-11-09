import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../utils/axios";
import { uploadImage } from "../../utils/upload";

const Share = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const mutation = useMutation({
    mutationFn: (newPost: { desc?: string; img?: string }) =>
      makeRequest.post("/post", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "posts",
      });
    },
  });

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let img = "";

    if (file) {
      try {
        img = await uploadImage(file);
      } catch (error) {
        console.error("Upload failed:", error);
        return;
      }
    }

    if (!desc.trim() && !img.trim()) {
      alert("Please add text or an image before sharing.");
      return;
    }

    mutation.mutate({ desc, img });
    setFile(null);
    setPreview(null);
    setDesc("");
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={
                currentUser?.profilePic
                  ? currentUser.profilePic
                  : "/uploads/boy.png"
              }
              alt={currentUser?.name}
            />
            <input
              type="text"
              placeholder={`What's on your mind, ${currentUser?.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {preview && <img className="file" alt="Preview" src={preview} />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files &&
                e.target.files[0] &&
                setFile(e.target.files[0])
              }
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="Add Image" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="Add Place" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="Tag Friends" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick} disabled={mutation.isPending}>
              {mutation.isPending ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
