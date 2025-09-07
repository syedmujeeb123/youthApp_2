import { useEffect, useState } from "react";
import { useFirebase } from "../../../context/Me_Firebase"; // adjust path
import { doc, getDoc } from "firebase/firestore";
import {db} from "../../../context/Me_Firebase";
const Show_username = () => {
  const { user, isloggedin } = useFirebase();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (user && isloggedin) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().name);
          }
        } catch (err) {
          console.error("Failed to fetch user name:", err);
        }
      }
    };

    fetchUsername();
  }, [user, isloggedin]);

  return username;
{username ? `Welcome,  ${username}` : ""}

};

export default Show_username;
