import "./header.module.scss";
import { logout, auth } from "../../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { db } from "../../../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Header = () => {
 
  return (
    <header>
      <img
        src="https://www.etu.edu.tr/files/logolar/standart_logo/dikey/tr/tobb_etu_dikey_tr.png"
        alt="TOBB ETU"
      />
      <h2>TOBB World Cup Scoreboard</h2>
      <button className="logout" onClick={logout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
