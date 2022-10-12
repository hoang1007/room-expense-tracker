import { DateTime } from ".";
import Item from "./item";

class User {
    readonly name: string;
    readonly uid: string;
    boughtItems: Item[];

    constructor(uid: string, name: string) {
        this.uid = uid;
        this.name = name;
        this.boughtItems = [];
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