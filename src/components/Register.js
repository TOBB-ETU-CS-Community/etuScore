import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../services/firebase";
import "./Register.css";
import Loading from "./Loading";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = () => {
    if (!name) {
      alert("Please enter a name");
    } else if (!email.endsWith("@etu.edu.tr")) {
      alert("Only email addresses with the domain 'etu.edu.tr' are allowed.");
    } else {
      registerWithEmailAndPassword(name, email.toLowerCase() , password);
    }
  };

  useEffect(() => {
    if (loading) {
      <Loading />;
    }
    if (user) { 
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="register">
      <div className="register__container">
        <div style={{marginBottom:"10px" }} >
          Only 'etu.edu.tr' are allowed. 
        </div>
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={handleNameChange}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={handleEmailChange}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <button className="register__btn" onClick={handleRegister}>
          Register
        </button>

        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Register;
