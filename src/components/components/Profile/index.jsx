import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import { db, fetchUserBets, leaveRoom, auth, getMatchTimeById } from "../../../services/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = ({ pairScoreGlobal }) => {
  const [user, loading, error] = useAuthState(auth);
  const [userBets, setUserBets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [playedBets, setPlayedBets] = useState(0);
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
                playedBets === 0 ? "" : styles.hidden
              }`}
            >
              <h3>{room.roomData?.name}</h3>
              <p>Creator: {room.roomData?.creatorName || ""}</p>
              <p style={{ color: "green" }}>Available Team: {room.roomData.availableTeam} </p>
              <p style={{ color: "red" }}>Against Team:{room.roomData.creatorsTeam}</p>
              <p style={{ color: "yellow" }}>Bet amount: {room.roomData.betAmount}🫘</p>
              {room.roomData?.participantName !== undefined &&
                room.roomData?.participantName !== "" &&
                room.roomData?.participantName !== null && (
                  <p>Participant: {room.roomData.participantName}</p>
                )}
                {(room.roomData.participant === undefined ||
                room.roomData.participant === "") && (
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
