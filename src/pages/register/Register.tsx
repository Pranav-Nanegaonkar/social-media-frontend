import React, { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { makeRequest } from "../../utils/axios";

interface FormDataProps {
  username: string;
  email: string;
  password: string;
  name: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validate = () => {
    if (!formData.username.trim()) {
      setErrorMessage("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Invalid email format");
      return false;
    }
    if (!formData.password) {
      setErrorMessage("Password is required");
      return false;
    } else if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      setErrorMessage("Password must have at least 8 characters, one uppercase letter, and one number");
      return false;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    return true;
  };

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await makeRequest.post("/auth/register", formData);
      setFormData({ username: "", email: "", password: "", name: "" });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      setErrorMessage(
        axiosError.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>

        <div className="right">
          <h1>Register</h1>
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={onChangeHandler}
              autoFocus
              autoComplete="username"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={onChangeHandler}
              autoComplete="new-password"
            />
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={onChangeHandler}
              autoComplete="name"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
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

export default Register;
