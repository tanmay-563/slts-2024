import { db } from "./initApp";
import { getDoc, doc } from "firebase/firestore";
import { auth } from "./initApp";

export const getUserData = async () => {
    if (!auth.currentUser) {
        return null;
    }

    const userDataDocRef = doc(db, "userData", auth.currentUser.uid);
    const docSnap = await getDoc(userDataDocRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}
