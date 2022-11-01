import { Item } from "../../objects";
import {
    FirebaseFirestoreTypes as Types
} from "@react-native-firebase/firestore";
import { Source } from "../../objects/item";
import User, { UserMetadata } from "../../objects/user";
import firestore from "@react-native-firebase/firestore";


export const itemConverter = {
    toFirestore(item: Item): Types.DocumentData {
        return {
            name: item.name,
            price: item.price.value,
            buyDate: firestore.Timestamp.fromDate(item.buyDate)
        }
    },
    fromFirestore(
        snapshot: Types.QueryDocumentSnapshot
    ): Item {
        const data = snapshot.data()!;

        return new Item(data.name, data.price, Source.DATABASE, data.buyDate.toDate());
    }
}

export const userConverter = {
    toFirestore(user: User): Types.DocumentData {
        return {
            name: user.name,
            items: user.getAllItems()
        }
    },
    fromFirestore(snapshot: Types.QueryDocumentSnapshot, metadata: UserMetadata): User {
        const data = snapshot.data()!;

        const user = new User(metadata.uid, metadata.username, metadata.username);

        const items: Item[] = data.items.map((itemData: Types.DocumentData) => {
            return new Item(itemData.name, itemData.price, Source.DATABASE, itemData.buyDate.toDate());
        });

        user.addItems(...items);

        return user;
    }
}