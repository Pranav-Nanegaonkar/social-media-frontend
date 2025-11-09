import React, { useContext, useState } from "react";

import "./update.scss";
import { useMutation } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { makeRequest } from "../../utils/axios";
import { queryClient } from "../../utils/queryClient";
import { AuthContext } from "../../context/authContext";
import { uploadImage } from "../../utils/upload";

interface UpdateProps {
  setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
}

const Update: React.FC<UpdateProps> = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState<File | null>();
  const [profile, setProfile] = useState<File | null>();
  const [texts, setTexts] = useState({
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const { checkAuth } = useContext(AuthContext);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTexts((prev: any) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: async (updatedUser: any) => {
      return await makeRequest.put("/user/update", updatedUser);
    },
    onSuccess: async () => {
      //Update currentUser
      checkAuth();

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleClick = async (e: any) => {
    e.preventDefault();

    //TODO: find a better way to get image URL

    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await uploadImage(cover) : user.coverPic;
    profileUrl = profile ? await uploadImage(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  const handleFileCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCover(e.target.files[0]);
    }
  };
  const handleFileProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile(e.target.files[0]);
    }
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : user.coverPic
                      ? user.coverPic
                      : "/uploads/cover.jpg"
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={handleFileCover}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : user.profilePic
                      ? user.profilePic
                      : "/uploads/boy.png"
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={handleFileProfile}
            />
          </div>
          {/* <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          /> */}
          {/* <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          /> */}
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
