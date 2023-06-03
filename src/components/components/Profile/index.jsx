import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import {
  db,
  fetchUserBets,
  leaveRoom,
  auth,
  getMatchTimeById,
} from "../../../services/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = ({ pairScoreGlobal }) => {
  const [user, loading, error] = useAuthState(auth);
  const [userBets, setUserBets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [playedBets, setPlayedBets] = useState(1);
  const fetchUserBetsLocal = async () => {
    const userBets = await fetchUserBets();
    setUserBets(userBets);
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
  return (
    <div className={styles.roomsPage}>
      <main className={styles.mainPart}>
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
                      room.roomData.betAmount
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
