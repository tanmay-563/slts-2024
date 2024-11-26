import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './initApp';

export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const signOut = () => {
    return auth.signOut();
}
