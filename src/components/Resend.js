import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, resendVerificationEmail } from "../services/firebase";
import "./Reset.css";

function Resend() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResendVerification = async () => {
    await resendVerificationEmail(email,password);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    if (loading) {
      // Show a loading screen or spinner while checking authentication state
      return;
    }
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
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
        <button className="reset__btn" onClick={handleResendVerification}>
          Send verification
        </button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Resend;
