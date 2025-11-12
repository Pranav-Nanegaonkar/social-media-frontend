import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Navbar: React.FC = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout logic
  const handleLogout = async (e: any) => {
    console.log("temp");

    e.preventDefault();

    const url = import.meta.env.VITE_BASE_URL + "/auth/logout";
    console.log(url);

    try {
      const { data } = await axios.post(url, {}, { withCredentials: true });
      setCurrentUser(null);
      console.log(data);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">TRENDS</span>
        </Link>
        <HomeOutlinedIcon aria-label="Home" />
        {darkMode ? (
          <WbSunnyOutlinedIcon aria-label="Light mode" onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon aria-label="Dark mode" onClick={toggle} />
        )}
        <GridViewOutlinedIcon aria-label="Apps" />
        <div className="search">
          <SearchOutlinedIcon />
          <input
            type="text"
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="right">
        <PersonOutlinedIcon aria-label="Profile" />
        <EmailOutlinedIcon aria-label="Messages" />
        <NotificationsOutlinedIcon aria-label="Notifications" />

        {/* User Profile + Dropdown */}
        <div
          className="user"
          onClick={() => setDropdownOpen((prev) => !prev)}
          ref={dropdownRef}
        >
          {currentUser ? (
            <>
              <img
                src={
                  currentUser.profilePic
                    ? currentUser.profilePic
                    : "/uploads/boy.png"
                }
                alt={currentUser.name}
              />
              <span>{currentUser.name}</span>

              {dropdownOpen && (
                <div className="dropdown">
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <PersonOutlinedIcon /> Profile
                  </Link>
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <LogoutOutlinedIcon /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
