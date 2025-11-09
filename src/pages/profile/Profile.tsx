import "./profile.scss";
import {
  FacebookTwoTone as FacebookTwoToneIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Pinterest as PinterestIcon,
  Twitter as TwitterIcon,
  Place as PlaceIcon,
  Language as LanguageIcon,
  EmailOutlined as EmailOutlinedIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import { useMutation, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../utils/axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { queryClient } from "../../utils/queryClient";

const Profile = () => {
  const userid = Number(useLocation().pathname.split("/")[2]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return null; // avoid early crash

  const { isPending, data } = useQuery({
    queryKey: ["user", userid],
    queryFn: async () => {
      const res = await makeRequest.get(`/user/find/${userid}`);
      return res?.data?.data;
    },
  });

  const { data: relationshipData, isPending: loading } = useQuery({
    queryKey: ["relationship", data?.id],
    queryFn: async () => {
      const res = await makeRequest.get(
        `/relationship?followedUserid=${data?.id}`
      );
      return res?.data?.data;
    },
    enabled: !!data?.id,
  });

  const mutation = useMutation({
    mutationFn: async (currentlyFollowing: boolean) => {
      if (currentlyFollowing) {
        return await makeRequest.delete(
          `/relationship?followedUserid=${data?.id}`
        );
      } else {
        return await makeRequest.post(
          `/relationship?followedUserid=${data?.id}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", data?.id] });
    },
  });

  const handleFollow = () => mutation.mutate(false);
  const handleUnfollow = () => mutation.mutate(true);

  return (
    <div className="profile">
      {isPending ? (
        "Loading..."
      ) : (
        <>
          <div className="images">
            <img
              src={
                currentUser?.profilePic
                  ? currentUser.coverPic
                  : "/uploads/cover.jpg"
              }
              alt="cover"
              className="cover"
            />
            <img
              src={
                currentUser?.profilePic
                  ? currentUser.profilePic
                  : "/uploads/boy.png"
              }
              alt="profile"
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                {[
                  FacebookTwoToneIcon,
                  InstagramIcon,
                  TwitterIcon,
                  LinkedInIcon,
                  PinterestIcon,
                ].map((Icon, i) => (
                  <a href="http://facebook.com" key={i}>
                    <Icon fontSize="large" />
                  </a>
                ))}
              </div>
              <div className="center">
                <span>{data?.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data?.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data?.website}</span>
                  </div>
                </div>

                {loading ? (
                  "loading..."
                ) : userid === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : relationshipData?.includes?.(currentUser.id) ? (
                  <button onClick={handleUnfollow}>Unfollow</button>
                ) : (
                  <button onClick={handleFollow}>Follow</button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts profileUserid={data?.id} />
          </div>
        </>
      )}
      {!isPending && openUpdate && (
        <Update setOpenUpdate={setOpenUpdate} user={data} />
      )}
    </div>
  );
};

export default Profile;
