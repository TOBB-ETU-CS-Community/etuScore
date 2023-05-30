import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import { db, fetchUserBets, leaveRoom, auth } from "../../../services/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = () => {
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
        console.log(userData.balance);
        setBalance(userData.balance);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchUserBetsLocal = async () => {
      const userBetsF = await fetchUserBets();
      console.log(userBetsF);
      setUserBets(userBetsF);
    };
    fetchUserBetsLocal();
    fetchBalance();
  }, [user?.uid]);

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
              className={`${styles.room} ${
                playedBets === 0 ? "" : styles.hidden
              }`}
            >
              <h3>{room.roomData.name}</h3>
              <p>Creator: {room.roomData.creatorName}</p>
              {room.roomData.participantName !== undefined &&
                room.roomData.participantName !== "" &&
                room.roomData.participantName !== null && (
                  <p>Participant: {room.roomData.participantName}</p>
                )}
              <p>Available Team: {room.roomData.availableTeam}</p>

              <button
                className={styles.button}
                onClick={async () => {
                  await leaveRoom(room.roomId, auth.currentUser.uid);
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
