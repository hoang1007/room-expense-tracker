import { DateTime } from ".";
import Item from "./item";


export interface UserMetadata {
    username: string,
    uid: string,
}


class User {
    readonly name: string;
    readonly metadata: UserMetadata;
    boughtItems: Item[];

    constructor(uid: string, name: string, username: string | undefined) {
        this.name = name
        this.boughtItems = []

        this.metadata = {username: username ?? name, uid: uid}
    }

    addItems(...items: Item[]) {
        this.boughtItems.push(...items);
        this.boughtItems.sort((a, b) => b.buyDate.getTime() - a.buyDate.getTime()); // desc
    }

    getItemsInMonth(month: DateTime.Month): Item[] {
        return this.boughtItems;
    }

    getAllItems(): Item[] {
        return this.boughtItems;
    }
}

export default User;