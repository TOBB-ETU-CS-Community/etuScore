import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import { db, fetchUserBets, leaveRoom, auth } from "../../../services/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = ({pairScoreGlobal}) => {
  const [user, loading, error] = useAuthState(auth);
  const [userBets, setUserBets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [playedBets, setPlayedBets] = useState(0);
  const fetchUserBetsLocal = async () => {
    const userBets = await fetchUserBets();
    setUserBets(userBets);
  };

  const fetchMatchTime = async (matchId) => {
    const q = query(collection(db, "matches"), where("matchNumber", "==", matchId));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const matchData = querySnapshot.docs[0].data();
      return matchData.matchTime;
    } else {
      // Handle case when no matching document is found
      return "No match data found";
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
              {room.roomData?.participantName !== undefined &&
                room.roomData?.participantName !== "" &&
                room.roomData?.participantName !== null && (
                  <p>Participant: {room.roomData.participantName}</p>
                )}
              <p>Chosen Team: {room.roomData?.creatorsTeam}</p>

              {console.log(fetchMatchTime(room.roomData.matchId))}
              <button
                className={styles.button}
                onClick={async () => {
                  await leaveRoom(room.roomId, auth.currentUser.uid, (room.roomData.betAmount));
                  await fetchUserBetsLocal();
                }}
              >
                Leave
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
