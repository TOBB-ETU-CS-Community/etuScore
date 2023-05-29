import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  setDoc,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

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
  getFirestore,
  query,
  getDocs,
  where,
  addDoc,
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

const createRoom = async (name, participants, matchId,creator) => {
  try {
    const roomCollectionRef = collection(db, "rooms");

    const newRoomRef = await addDoc(roomCollectionRef, {
      creator:creator,
      name:name,
      participants:[...participants,creator],
      matchId:matchId,
    });

    const roomId = newRoomRef.id;
    return roomId;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Example usage
const createRoomForCurrentUser = async (name, participants,matchId) => {
  try {

    // Get the currently authenticated user
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;

      // Create a new room for the user
      const roomId = await createRoom(name, [], matchId, userId);
      console.log("Room created with ID:", roomId);
      return roomId;
    } else {
      console.log("No authenticated user found");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Adding a participant to a room
const addParticipantToRoom = async (roomId, participantId) => {
  try {
    const roomDocRef = doc(db, "rooms", roomId);

    const roomSnapshot = await getDocs(roomDocRef);
    const roomData = roomSnapshot.data();
    const participants = roomData.participants || [];

    await setDoc(
      roomDocRef,
      {
        participants: [...participants, participantId],
      },
      { merge: true }
    );

    console.log("Participant added to room successfully");
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
  saveDataToFirestore,
  fetchGroupsFireStore,
  fetchMatchesFireStore,
};
