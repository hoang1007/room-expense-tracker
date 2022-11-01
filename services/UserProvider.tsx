import React from "react";
import User, { UserMetadata } from "../objects/user";
import firestore from "@react-native-firebase/firestore";
import { itemConverter, userConverter } from "./utils/converter";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { DateTime, Item } from "../objects";

GoogleSignin.configure({
    webClientId: "32938900144-ia6f48568tebrg952p7rrsbd6kfn5m6c.apps.googleusercontent.com"
});


const getMonthDocument = (month: DateTime.Month) => {
    return firestore().collection("Months").doc(month.toLocaleString())
}

const getItemMonthCollection = (month: DateTime.Month) => {
    return getMonthDocument(month).collection("Users")
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
    const [userMetadata, setUserMetadata] = React.useState<Record<string, UserMetadata>>()

    React.useEffect(() => {
        firestore().collection("Users").get().then((querySnapshot) => {
            let userMetadata_: Record<string, UserMetadata> = {}

            querySnapshot.forEach((docSnapshot) => {
                let uid = docSnapshot.id
                let username = docSnapshot.get<string>("username")

                userMetadata_[uid] = { username: username, uid: uid }
            })

            setUserMetadata(userMetadata_)
        }).catch((err) => {
            console.error(err);
        })
    }, [])

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
        if (authInfo && userMetadata) {
            const databaseSubscriber = getItemMonthCollection(DateTime.Month.now).onSnapshot(
                (querySnapshot) => {
                    const newUsers: User[] = []

                    for (let uid in userMetadata) {
                        const metadata = userMetadata[uid]

                        const docSnapshot = querySnapshot.docs.find(doc => doc.id === metadata.uid)

                        if (docSnapshot) {
                            const user = userConverter.fromFirestore(docSnapshot, metadata)

                            newUsers.push(user)
                        } else {
                            newUsers.push(new User(metadata.uid, metadata.username, metadata.username))
                        }
                    }

                    setUsers(newUsers)

                }, (error) => {
                    console.error(error)
                }
            )

            return databaseSubscriber;
        }
    }, [userMetadata, authInfo])

    const addItems = (items: Item[]) => {
        return getItemMonthCollection(DateTime.Month.now).doc(authInfo!.uid).set({
            items: firestore.FieldValue.arrayUnion(...items.map((item) => itemConverter.toFirestore(item)))
        }, { merge: true });
    }

    const getUsersInMonth = async (month: DateTime.Month) => {
        return getItemMonthCollection(month).get().then((querySnapshot) => {
            const users_: User[] = []

            for (let uid in userMetadata) {
                const metadata = userMetadata[uid]

                const docSnapshot = querySnapshot.docs.find(doc => doc.id === metadata.uid)

                if (docSnapshot) {
                    const user = userConverter.fromFirestore(docSnapshot, metadata)

                    users_.push(user)
                } else {
                    users_.push(new User(metadata.uid, metadata.username, metadata.username))
                }
            }

            return users_;
        });
    }

    const getPaidStatus = async (month: DateTime.Month) => {
        const res = await getMonthDocument(month).get();
        return res.get<boolean>("status");
    }

    const setPaidStatus = (month: DateTime.Month, status: boolean) => {
        return getMonthDocument(month).set({
            status: status
        });
    }

    return (
        <UserContext.Provider
            value={{
                users: users,
                authInfo: authInfo,
                addItems: addItems,
                selfUser: users.find((user) => user.metadata.uid === authInfo?.uid),
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

    // return firestore().collection("Users").doc(user.uid).set({
    //     username: user.displayName
    // }, { merge: true })
};