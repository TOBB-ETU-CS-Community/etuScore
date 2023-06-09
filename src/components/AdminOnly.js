import { useEffect, useState } from "react";
import { query, collection, getDocs, where, doc } from "firebase/firestore";
import { auth, db, returnBets } from "../services/firebase"; // Your firebase service
import { useAuthState } from "react-firebase-hooks/auth";
import { saveDataToFirestore, fetchMatchesFireStore,fetchGroupsFireStore } from "../services/firebase";
import  "./AdminOnly.scss";
const AdminOnlyComponent = () => {
  const [currentUser, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserAdminStatus = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "users"),
          where("userId", "==", currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();
        const isAdmin = userData?.isAdmin || false;
        setIsAdmin(isAdmin);
      }
    };

    fetchUserAdminStatus();
  }, [currentUser]);

  if (isAdmin) {
    return (
      <div className="admin-button">
        <button  onClick={saveDataToFirestore}> Save Sheets To FireStore</button>
        <button onClick={fetchMatchesFireStore}> fetchMatches from FireStore</button>
        <button onClick={fetchGroupsFireStore}> fetchGroups from FireStore</button>
        <button onClick={returnBets}> returnBets</button>
      </div>
    );
  } else {
    return <></>;
  }
};

export default AdminOnlyComponent;
