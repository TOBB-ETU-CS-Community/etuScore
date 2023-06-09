import { initializeApp } from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  orderBy,
  limit,
  serverTimestamp,
  getFirestore,
  query,
  getDocs,
  getDoc,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import SheetsService from "./sheets.service";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBSE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Check if the user's email is verified
    if (!user.emailVerified) {
      // Sign out the user
      signOut(auth);
      throw new Error(
        "Email not verified. Please check your email to verify your account."
      );
    }
    //find user in db
    const q = query(collection(db, "users"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userData = querySnapshot.docs[0].data();
    if (userData.isVerified === false) {
      await updateDoc(querySnapshot.docs[0].ref, {
        isVerified: true,
      });
    }

    // Proceed with login
    // ...
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await addDoc(collection(db, "users"), {
      userId: user.uid,
      username: name,
      email,
      friends: [],
      bets: [],
      isAdmin: false,
      authProvider: "local",
      balance: 5,
      isReffered: false,
      isVerified: false,
    });

    // Send verification email
    await sendEmailVerification(auth.currentUser);

    alert(
      "Registration successful! Please check your email to verify your account."
    );
    // Sign out the user
    signOut(auth);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const resendVerificationEmail = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    if (user?.email === email && !user?.emailVerified) {
      sendEmailVerification(auth?.currentUser);

      signOut(auth);

      alert("Email verification resent!");
    } else if(user?.emailVerified) {
      await signOut(auth);
      alert("Email already verified!");
    }else {
      alert("Emails do not match!");
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const addReffererBalance = async (reffererMail) => {
  const currentUser = auth.currentUser;
  if (currentUser.isReffered) {
    alert("You have already been reffered");
    return false;
  }
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", reffererMail)
    );
    const querySnapshot = await getDocs(q);
    const userData = querySnapshot.docs[0].data();

    const q2 = query(
      collection(db, "users"),
      where("userId", "==", userData.userId)
    );
    const querySnapshot2 = await getDocs(q2);
    const userDocRef = querySnapshot2.docs[0].ref;
    await updateDoc(userDocRef, {
      balance: userData.balance + 5,
    });

    const success = await addCurrentUserBalance();
    return success && true;
  } catch (err) {
    console.error(err);
    alert(err.message);
    return false;
  }
};

const addCurrentUserBalance = async () => {
  try {
    const currentUser = auth.currentUser;
    const q = query(
      collection(db, "users"),
      where("userId", "==", currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    const userDocRef = querySnapshot.docs[0].ref;
    await updateDoc(userDocRef, {
      balance: querySnapshot.docs[0].data().balance + 5,
      isReffered: true,
    });
    return true;
  } catch (err) {
    console.error(err);
    alert(err.message);
    return false;
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const leaderBoard = async () => {
  const q = query(
    collection(db, "users"),
    where("isVerified", "==", true),
    orderBy("balance", "desc"),
    limit(100)
  );
  const querySnapshot = await getDocs(q);
  const leaderboard = querySnapshot.docs.map((doc) => {
    return { username: doc.data().username, balance: doc.data().balance };
  });
  return leaderboard;
};

const createRoom = async (
  name,
  creatorName,
  participant,
  participantName,
  matchId,
  creator,
  creatorsTeam,
  availableTeam,
  Startdate,
  betAmount,
  gameTime
) => {
  try {
    const roomCollectionRef = collection(db, "rooms");
    const newRoomRef = await addDoc(roomCollectionRef, {
      creator: creator,
      creatorName: creatorName,
      name: name,
      participant: participant,
      participantName: participantName,
      matchId: matchId,
      creatorsTeam: creatorsTeam,
      availableTeam: availableTeam,
      createdAt: serverTimestamp(),
      Startdate: Startdate,
      betAmount: betAmount,
      gameFinished: false,
      roomId: generateRandomRoomId(10),
      gameTime,
    });

    const roomId = newRoomRef.id;
    return roomId;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

function generateRandomRoomId(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let roomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters.charAt(randomIndex);
  }

  return roomId;
}

async function checkBalanceIsEnough(betAmount) {
  const currentUser = auth.currentUser;
  let userData;
  let querySnapshot;
  if (currentUser) {
    const userId = currentUser.uid;

    try {
      const q = query(
        collection(db, "users"),
        where("userId", "==", currentUser?.uid)
      );
      querySnapshot = await getDocs(q);
      userData = querySnapshot.docs[0].data();
    } catch (err) {
      console.log(err);
    }
    if (betAmount < 0) {
      //add + amount to balance
      const userDocRef = querySnapshot.docs[0].ref;
      const newBalance = userData.balance + betAmount * -1;
      await updateDoc(userDocRef, { balance: newBalance });
      return true;
    }
    if (userData.balance >= betAmount) {
      const userDocRef = querySnapshot.docs[0].ref;
      const newBalance = userData.balance - betAmount;
      await updateDoc(userDocRef, { balance: newBalance });
      return true;
    } else {
      console.log("Not enough balance");
      return false;
    }
  }
}

const createRoomForCurrentUser = async (
  name,
  matchId,
  team,
  availableTeam,
  pairScore,
  Startdate,
  betAmount,
  gameTime
) => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;

      try {
        const q = query(
          collection(db, "users"),
          where("userId", "==", currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();
        const roomId = await createRoom(
          name,
          userData.username,
          "",
          "",
          matchId,
          userId,
          team,
          availableTeam,
          pairScore,
          Startdate,
          betAmount,
          gameTime
        );

        // Add roomId to the bets array of the user
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {
          bets: arrayUnion(roomId),
        });

        return roomId;
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("No authenticated user found");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const addParticipantToRoom = async (roomId) => {
  try {
    const currentUser = auth?.currentUser;
    const roomDocRef = doc(db, "rooms", roomId);

    const roomSnapshot = await getDoc(roomDocRef);
    const roomData = roomSnapshot.data();
    if (roomData.creator === currentUser.uid) {
      console.log("Creator cannot join the same room");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("userId", "==", currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs[0].data();
      await setDoc(
        roomDocRef,
        {
          participant: currentUser.uid,
          participantName: userData.username,
        },
        { merge: true }
      );

      // Add roomId to the bets array of the user
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        bets: arrayUnion(roomId),
      });

      console.log("Participant added to room successfully");
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
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

const leaveRoom = async (
  roomId,
  participantId,
  betAmount,
  startDate,
  gameTime
) => {
  try {
    const roomDocRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(roomDocRef);
    const roomData = roomSnapshot.data();
    if (isMatchPast(gameTime, startDate)) {
      console.log("Match has already started");
    } else {
      if (roomData.creator === participantId) {
        await checkBalanceIsEnough(-1 * betAmount);
        if (roomData.participant) {
          await setDoc(
            roomDocRef,
            {
              creator: roomData.participant,
              creatorName: roomData.participantName,
              participant: null,
              participantName: null,
            },
            { merge: true }
          );
          // Add roomId to the bets array of the user
          const q = query(
            collection(db, "users"),
            where("userId", "==", auth?.currentUser?.uid)
          );
          const querySnapshot = await getDocs(q);
          const userDocRef = querySnapshot.docs[0].ref;
          await updateDoc(userDocRef, {
            bets: arrayRemove(roomId),
          });

          console.log("Ownership transferred to participant");
        } else {
          await deleteDoc(roomDocRef);

          // remove roomId from the bets array of the user
          const q = query(
            collection(db, "users"),
            where("userId", "==", auth?.currentUser?.uid)
          );
          const querySnapshot = await getDocs(q);
          const userDocRef = querySnapshot.docs[0].ref;

          await updateDoc(userDocRef, {
            bets: arrayRemove(roomId),
          });

          console.log("Room deleted");
          return;
        }
      } else if (roomData.participant === participantId) {
        checkBalanceIsEnough(-1 * betAmount);

        await setDoc(
          roomDocRef,
          {
            participant: null,
            participantName: null,
          },
          { merge: true }
        );

        // remove roomId from the bets array of the user
        const q = query(
          collection(db, "users"),
          where("userId", "==", auth?.currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        const userDocRef = querySnapshot.docs[0].ref;

        await updateDoc(userDocRef, {
          bets: arrayRemove(roomId),
        });

        console.log("Participant left the room");
      } else {
        console.log("Participant is not in the room");
        return;
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const fetchUserBets = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;

      try {
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();
        const bets = userData.bets || [];
        const roomPromises = bets.map(async (roomId) => {
          const roomDoc = doc(db, "rooms", roomId);
          const roomSnapshot = await getDoc(roomDoc);
          const roomData = roomSnapshot.data();
          return { roomData, roomId };
        });

        const userBets = await Promise.all(roomPromises);
        return userBets;
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      console.log("No authenticated user found");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getRoomsByActiveMatchId = async (activeMatchId) => {
  try {
    const roomsCollectionRef = collection(db, "rooms");

    const querySnapshot = await getDocs(
      query(roomsCollectionRef, where("matchId", "==", activeMatchId))
    );

    const rooms = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return rooms;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//control all rooms from firebase for gameFinished false, if score is 2-0 2-1 find the user from creator or 0-2 1-2 find the user from participant and add their balance to betAmount*2
const returnBets = async () => {
  try {
    const roomsCollectionRef = collection(db, "rooms");
    const querySnapshot = await getDocs(
      query(roomsCollectionRef, where("gameFinished", "==", false))
    );
    const rooms = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    //for every room find the creator and participant
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if(room.gameFinished) continue;
      if(!isMatchPast(room.gameTime, room.startDate)) continue;
      const roomRef = doc(db, "rooms", room.id);
      const creator = room.creator;
      const creatorsTeam = room.creatorsTeam;
      const participant = room.participant;
      const betAmount = room.betAmount;
      if (!participant) {
        const creatorUser = await getUserById(creator);
        const creatorBalance = creatorUser.balance;
        const newCreatorBalance = creatorBalance + betAmount;
        await updateDoc(creatorUser.ref, {
          balance: newCreatorBalance,
        });
        continue;
      }
      const matchId = room.matchId;
      const response = await getMatchScoreById(matchId);
      //if match score is 2-0 or 2-1
      if (response.result[0] === 2) {
        if (creatorsTeam === response.team1) {
          //find the user from creator
          const creatorUser = await getUserById(creator);
          const creatorBalance = creatorUser.balance;
          const newCreatorBalance = creatorBalance + betAmount * 2;
          await updateDoc(creatorUser.ref, {
            balance: newCreatorBalance,
          });
          //set gameFinished to true
          await updateDoc(roomRef, {
            gameFinished: true,
          });
        } else {
          //find the user from participant
          const participantUser = await getUserById(participant);
          const participantBalance = participantUser.balance;
          const newParticipantBalance = participantBalance + betAmount * 2;
          await updateDoc(participantUser.ref, {
            balance: newParticipantBalance,
          });
          //set gameFinished to true
          await updateDoc(roomRef, {
            gameFinished: true,
          });
        }
      } else {
        if (creatorsTeam === response.team2) {
          //find the user from creator
          const creatorUser = await getUserById(creator);
          const creatorBalance = creatorUser.balance;
          const newCreatorBalance = creatorBalance + betAmount * 2;
          await updateDoc(creatorUser.ref, {
            balance: newCreatorBalance,
          });
          //set gameFinished to true
          await updateDoc(roomRef, {
            gameFinished: true,
          });
        } else {
          //find the user from participant
          const participantUser = await getUserById(participant);
          const participantBalance = participantUser.balance;
          const newParticipantBalance = participantBalance + betAmount * 2;
          await updateDoc(participantUser.ref, {
            balance: newParticipantBalance,
          });
          //set gameFinished to true
          await updateDoc(roomRef, {
            gameFinished: true,
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getMatchScoreById = async (matchId) => {
  //call the fetchmatches and for the find match with matchId
  const matchesData = await fetchMatchesFireStore();
  const matchesValues = matchesData.data;
  const matchesDataObjects = matchesValues.map((match) => {
    if (Object.keys(match).length > 6) {
      const matchNumber = match.matchNumber;
      const group = match.group;
      const team1 = match.team1;
      const team2 = match.team2;
      const date = match.date;
      const time = match.time;
      let result = match.result;
      //if result have (h) delete it
      if (result.includes("(h)")) {
        result = result.replace("(h)", "");
      }
      return {
        matchNumber,
        group,
        team1,
        team2,
        date,
        time,
        result,
      };
    } else {
      const matchNumber = match.matchNumber;
      return {
        matchNumber: matchNumber,
        result: "0-0",
      };
    }
  });
  const match = matchesDataObjects.find(
    (match) => match.matchNumber === String(matchId - 1)
  );
  return match;
};

const getMatchTimeById = async (matchId) => {
  //call the fetchmatches and for the find match with matchId
  const matchesData = await SheetsService.fetchMatches();
  const matchesValues = matchesData.values;
  const matchesDataObjects = matchesValues.map((match) => {
    if (match.length >= 7) {
      const matchNumber = match[0];
      const group = match[1];
      const team1 = match[2];
      const team2 = match[3];
      const date = match[4];
      const time = match[5];
      const result = match[6];
      return {
        matchNumber,
        group,
        team1,
        team2,
        date,
        time,
        result,
      };
    } else {
      const matchNumber = match[0];
      const time = match[5];
      return {
        matchNumber: matchNumber,
        time: time,
      };
    }
  });
  const match = matchesDataObjects.find(
    (match) => match.matchNumber === matchId
  );
  return match.time;
};

const getUserById = async (userId) => {
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const documentSnapshot = querySnapshot.docs[0];
  const userData = documentSnapshot.data();
  return { ...userData, ref: documentSnapshot.ref };
};

async function saveDataToFirestore() {
  try {
    const matchesData = await SheetsService.fetchMatches();
    const groupsData = await SheetsService.fetchGroups();

    const matchesValues = matchesData.values;
    const groupsValues = groupsData;

    const matchesDataObjects = matchesValues.map((match) => {
      if (match.length < 7) {
        const matchNumber = match[0];
        const group = match[1];
        const team1 = match[2];
        const team2 = match[3];
        const date = match[4];
        const time = match[5];
        return {
          matchNumber,
          group,
          team1,
          team2,
          date,
          time,
        };
      }
      const matchNumber = match[0];
      const group = match[1];
      const team1 = match[2];
      const team2 = match[3];
      const date = match[4];
      const time = match[5];
      const result = match[6];

      return {
        matchNumber,
        group,
        team1,
        team2,
        date,
        time,
        result,
      };
    });
    const groupsDataObjects = groupsValues.map((group) => {
      const grup1 = group[0];
      const grup2 = group[1];
      const grup3 = group[2];
      const grup4 = group[3];
      const grup5 = group[4];

      return {
        grup1,
        grup2,
        grup3,
        grup4,
        grup5,
      };
    });
    // Save matches data to Firestore
    await addDoc(collection(db, "matches"), {
      data: matchesDataObjects,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "groups"), {
      data: groupsDataObjects,
      createdAt: serverTimestamp(),
    });

    alert("Data saved to Firestore successfully");
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    throw error;
  }
}
// Read groups from Firestore
async function fetchGroupsFireStore() {
  const groupsRef = collection(db, "groups");
  const query1 = query(groupsRef, orderBy("createdAt", "desc"), limit(1));
  const groupsSnapshot = await getDocs(query1);

  const groupsData = groupsSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  // Log the groups data
  return groupsData[0];
}

// Read matches from Firestore
async function fetchMatchesFireStore() {
  const matchesRef = collection(db, "matches");

  const query1 = query(matchesRef, orderBy("createdAt", "desc"), limit(1));

  const matchesSnapshot = await getDocs(query1);

  const matchesData = matchesSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return matchesData[0];
}

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  createRoom,
  createRoomForCurrentUser,
  addParticipantToRoom,
  getRoomsByActiveMatchId,
  leaveRoom,
  saveDataToFirestore,
  fetchGroupsFireStore,
  fetchMatchesFireStore,
  fetchUserBets,
  checkBalanceIsEnough,
  leaderBoard,
  returnBets,
  getMatchTimeById,
  addReffererBalance,
  resendVerificationEmail,
};
