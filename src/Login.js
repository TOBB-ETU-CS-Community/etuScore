import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import ReactLoading from "react-loading";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      
      return;
    }
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    logInWithEmailAndPassword(email, password);
  };

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={handleEmailChange}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <button className="login__btn" onClick={handleLogin}>
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google {loading === true && (
        <ReactLoading
          className="spinner"
          type="spin"
          color="#FF6100"
          height={50}
          width={50}
        />
      )}
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Login;
