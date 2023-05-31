import "./header.module.scss";
import { logout } from "../../../services/firebase";
import { useState } from "react";

const Header = ({ PageInd, setPageInd }) => {
  const groups = () => {
    setPageInd(1);
  };
  const matches = () => {
    setPageInd(0);
  };
  const profile = () => {
    setPageInd(3);
  };
  const leaderboard = () => {
    setPageInd(4);
  }

  return (
    <header className="header">
      <img
        src="https://www.etu.edu.tr/files/logolar/standart_logo/dikey/tr/tobb_etu_dikey_tr.png"
        alt="TOBB ETU"
      />
      <h2>TOBB World Cup Scoreboard</h2>
      <div className="button-group">
      <button className="profile" onClick={profile}>
          My Profile
        </button>
        <button className="matches" onClick={matches}>
          Matches
        </button>
        <button className="groups" onClick={groups}>
          Groups
        </button>
        <button className="leaderboard" onClick={leaderboard}>
          Leaderboard
        </button>
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
