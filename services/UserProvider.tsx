import React from "react";
import User from "../objects/user";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { itemConverter, userConverter } from "./utils/converter";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { DateTime, Item } from "../objects";

GoogleSignin.configure({
    webClientId: "32938900144-ia6f48568tebrg952p7rrsbd6kfn5m6c.apps.googleusercontent.com"
});

const getUsersCollection = (month: DateTime.Month) => {
    return firestore().collection("Months").doc(month.toLocaleString()).collection("Users");
}

export interface UserController {
    users: User[],
    selfUser: User | undefined,
    authInfo: FirebaseAuthTypes.User | undefined,
    addItems: (items: Item[]) => Promise<void>,
    getUsersInMonth: (month: DateTime.Month) => Promise<User[]>,
    getPaidStatus: (month: DateTime.Month) => Promise<boolean>,
    setPaidStatus: (month: DateTime.Month, status: boolean) => Promise<void>
}

export const UserContext = React.createContext<UserController | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = React.useState<User[]>([]);
    const [authInfo, setAuthInfo] = React.useState<FirebaseAuthTypes.User>();

    React.useEffect(() => {
        const unsubscribeFromAuthStatusChanged = auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setAuthInfo(user);
            } else {
                // User is signed out
                setAuthInfo(undefined);
            }
        });

        return unsubscribeFromAuthStatusChanged;
    }, []);

    React.useEffect(() => {
        if (authInfo) {
            const databaseSubscriber = getUsersCollection(DateTime.Month.now).onSnapshot(
                (querySnapshot) => {
                    const newUsers: User[] = [];

                    querySnapshot.forEach((docSnapshot) => {
                        const user = userConverter.fromFirestore(docSnapshot);

                        newUsers.push(user);
                    });

                    setUsers(newUsers);

                    console.log("Loaded new data");
                },
                (error) => {
                    console.error(error);
                }
            )

            return databaseSubscriber;
        }
    }, [authInfo])

    const addItems = (items: Item[]) => {
        return getUsersCollection(DateTime.Month.now).doc(authInfo!.uid).update({
            items: firestore.FieldValue.arrayUnion(...items.map((item) => itemConverter.toFirestore(item)))
        });
    }

    const getUsersInMonth = async (month: DateTime.Month) => {
        return getUsersCollection(month).get().then((querySnapshot) => {
            const users_: User[] = [];

            querySnapshot.forEach((docSnapshot) => {
                const user = userConverter.fromFirestore(docSnapshot);

                users_.push(user);
            });

            return users_;
        });
    }

    const getPaidStatus = async (month: DateTime.Month) => {
        const doc = firestore().collection("Months").doc(month.toLocaleString())

        const res = await doc.get();
        return res.get<boolean>("status");
    }

    const setPaidStatus = (month: DateTime.Month, status: boolean) => {
        return firestore().collection("Months").doc(month.toLocaleString()).set({
            status: status
        });
    }

    return (
        <UserContext.Provider
            value={{
                users: users,
                authInfo: authInfo,
                addItems: addItems,
                selfUser: users.find((user) => user.uid === authInfo?.uid),
                getUsersInMonth: getUsersInMonth,
                getPaidStatus: getPaidStatus,
                setPaidStatus: setPaidStatus
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export async function googleLogin() {
    const userInfo = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

    const { user } = await auth().signInWithCredential(googleCredential);

    const userDoc = getUsersCollection(DateTime.Month.now).doc(user.uid);

    return userDoc.get().then((docSnapshot) => {
        if (!docSnapshot.exists) {
            userDoc.set(userConverter.toFirestore(new User(user.uid, user.displayName!)))
        }
    });
};