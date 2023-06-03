import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import {
  db,
  fetchUserBets,
  leaveRoom,
  auth,
  getMatchTimeById,
  addReffererBalance,
} from "../../../services/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = ({ pairScoreGlobal }) => {
  const [user, loading, error] = useAuthState(auth);
  const [userBets, setUserBets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [playedBets, setPlayedBets] = useState(1);
  const [isReffered, setIsReffered] = useState(false);
  const [referrer, setReferrer] = useState("");
  const fetchUserBetsLocal = async () => {
    const userBets = await fetchUserBets();
    setUserBets(userBets);
  };

  const fetchBalance = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs[0].data();
      setBalance(userData.balance);
      setIsReffered(userData.isReffered);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("userId", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();
        setBalance(userData.balance);
        setIsReffered(userData.isReffered);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchUserBetsLocal = async () => {
      const userBetsF = await fetchUserBets();
      setUserBets(userBetsF);
    };
    fetchUserBetsLocal();
    fetchBalance();
  }, [user?.uid]);

  const currDate = new Date();
  const currTime = currDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const currDay = currDate.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const handleReffererChange = (e) => {
    setReferrer(e.target.value);
  };
  const isMatchPast = (hourMinute, startDate) => {
    const currentDate = new Date();
    const [day, month, year] = startDate.split(".");
    const gameStartDate = new Date(`${month}/${day}/${year}`);

    // Assuming hourMinute is in format "HH:mm"

    // Extracting hours and minutes from hourMinute
    const [gameTimeHours, gameTimeMinutes] = hourMinute.split(".");

    // Setting the game start time with the same date as gameStartDate, but with gameTime hours and minutes
    gameStartDate.setHours(gameTimeHours);
    gameStartDate.setMinutes(gameTimeMinutes);
    gameStartDate.setSeconds(0); // Reset seconds to 0 to ensure accurate comparison

    const currentDateString = `${currentDate.getDate()}:${
      currentDate.getMonth() + 1
    }:${currentDate.getFullYear()}`;
    const gameStartDateString = `${gameStartDate.getDate()}:${
      gameStartDate.getMonth() + 1
    }:${gameStartDate.getFullYear()}`;

    return currentDate.getTime() > gameStartDate.getTime();
  };
  const formControl = async (e) => {
    e.preventDefault();
    if (isReffered === "") {
      alert("Please enter a valid refferer ");
      return false;
    } else if (!referrer.endsWith("@etu.edu.tr")) {
      alert("Please enter an etu.edu.tr mail address ");
      return false;
    } else {
      const success = await addReffererBalance(referrer);
      setIsReffered(success);
      if (success === true) {
        await fetchBalance();
      }
      return success;
    }
  };

  return (
    <div className={styles.roomsPage}>
      <main className={styles.mainPart}>
        {isReffered === false && (
          <form className={styles.formContainer}>
            <input
              type="text"
              placeholder="Enter refferer mail"
              value={referrer}
              onChange={handleReffererChange}
              className={styles.input}
            />
            <button onClick={formControl}>Add Referrer</button>
          </form>
        )}
        <h2> Balance: {balance} 🫘</h2>
        <div className={styles.teamButtons}>
          <button
            className={playedBets === 0 ? styles.teama : styles.teamb}
            onClick={() => setPlayedBets(0)}
          >
            Finished Bets
          </button>
          <button
            className={playedBets === 1 ? styles.teama : styles.teamb}
            onClick={() => setPlayedBets(1)}
          >
            Incoming Bets
          </button>
        </div>
        <div className={styles.rooms}>
          {userBets?.map((room) => (
            <div
              key={room.roomId}
              className={`${styles.room} ${
                playedBets ===
                (isMatchPast(room.roomData.gameTime, room.roomData.Startdate)
                  ? 0
                  : 1)
                  ? ""
                  : styles.hidden
              }`}
            >
              <h3>{room.roomData?.name}</h3>
              <p>Creator: {room.roomData?.creatorName || ""}</p>
              <p style={{ color: "green" }}>
                Available Team: {room.roomData.availableTeam}{" "}
              </p>
              <p style={{ color: "red" }}>
                Against Team: {room.roomData.creatorsTeam}
              </p>
              <p style={{ color: "yellow" }}>
                Bet amount: {room.roomData.betAmount}🫘
              </p>
              {room.roomData?.participantName !== undefined &&
                room.roomData?.participantName !== "" &&
                room.roomData?.participantName !== null && (
                  <p>Participant: {room.roomData.participantName}</p>
                )}
              {!isMatchPast(
                room.roomData.gameTime,
                room.roomData.Startdate
              ) && (
                <button
                  className={styles.button}
                  onClick={async () => {
                    await leaveRoom(
                      room.roomId,
                      auth.currentUser.uid,
                      room.roomData.betAmount,
                      room.roomData.Startdate,
                      room.roomData.gameTime
                    );
                    await fetchUserBetsLocal();
                  }}
                >
                  Leave
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
