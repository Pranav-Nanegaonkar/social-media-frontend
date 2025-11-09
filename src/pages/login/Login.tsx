import React, { useContext, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../utils/axios";

interface LoginDataProps {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginDataProps>({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useContext(AuthContext);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const validate = () => {
    if (!loginData.username.trim()) {
      setErrorMessage("Username is required");
      return false;
    }
    if (!loginData.password) {
      setErrorMessage("Password is required");
      return false;
    }
    return true;
  };

  
  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await makeRequest.post("/auth/login", loginData, {
        withCredentials: true,
      });

      if (import.meta.env.DEV) console.log("Login success:", response.data);

      await checkAuth(); // ensure context updates
      navigate("/");
    } catch (error) {
      const serverMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Invalid credentials or server error";
      setErrorMessage(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident sint ullam
            voluptate laboriosam sequi atque quia sit ut repellat.
          </p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>

        <div className="right">
          <h1>Login</h1>
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={onChangeHandler}
              placeholder="Username"
              autoFocus
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={onChangeHandler}
              placeholder="Password"
              autoComplete="current-password"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {errorMessage && (
              <p className="error" aria-live="polite">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
