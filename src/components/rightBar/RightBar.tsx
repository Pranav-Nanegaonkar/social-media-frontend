import type React from "react";
import "./rightbar.scss";

const dummyUsers = [
  { id: 1, name: "Jane Doe", img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { id: 2, name: "John Smith", img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600" },
  { id: 3, name: "Emma Brown", img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600" },
];

const RightBar: React.FC = () => {
  return (
    <div className="rightBar">
      <div className="container">

        {/* Suggestions Section */}
        <div className="item">
          <span>Suggestions For You</span>
          {dummyUsers.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt={`${user.name}'s profile`} />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button>Follow</button>
                <button>Dismiss</button>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Activities */}
        <div className="item">
          <span>Latest Activities</span>
          {dummyUsers.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt={`${user.name}'s profile`} />
                <p>
                  <span>{user.name}</span> changed cover picture
                </p>
              </div>
              <span>1 min ago</span>
            </div>
          ))}
        </div>

        {/* Online Friends */}
        <div className="item">
          <span>Online Friends</span>
          {dummyUsers.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt={`${user.name}'s profile`} />
                <div className="online" />
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RightBar;
