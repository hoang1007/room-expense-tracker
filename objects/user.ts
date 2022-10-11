import { DateTime } from ".";
import { groupByMonth } from "../utils/query";
import { Month } from "./datetime";
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
        // let grItems = groupByMonth(items);

        // this.boughtItems = {...this.boughtItems, ...grItems};
        this.boughtItems.push(...items);
    }

    // addItemsInMonth(items: Item[], month: DateTime.Month) {
    //     const key = month.toLocaleString();

    //     if (this.boughtItems[key] === undefined) {
    //         // this.boughtItems.get(month)!.push(...items);
    //         this.boughtItems[key].push(...items);
    //     } else {
    //         this.boughtItems[key] = items;
    //     }
    // }

    getItemsInMonth(month: DateTime.Month): Item[] {
        // return this.boughtItems.filter((item) => DateTime.Month.fromDate(item.buyDate).equal(month));
        return this.boughtItems;
    }

    getAllItems(): Item[] {
        return this.boughtItems;
    }
}

export default User;