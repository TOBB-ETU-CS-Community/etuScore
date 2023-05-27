import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs[0].data();
      setName(userData.name);
    } catch (err) {
      console.error(err);
      
    }
  };

  useEffect(() => {
    if (loading) {
      // Show a loading screen or spinner while checking authentication state
      return;
    }
    if (!user) {
      navigate("/");
    } else {
      fetchUserName();
    }
  }, [user, loading, navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div>Logged in as</div>
        <div>{name}</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
