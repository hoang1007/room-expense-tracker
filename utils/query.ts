import { Item } from "../objects";

export function groupByDate(items: Item[], keyExtractor: (date: Date) => string) {
    let group: Record<string, Item[]> = {};

    items.forEach((item) => {
        let key = keyExtractor(item.buyDate);

        if (group[key] === undefined) {
            group[key] = [item];
        } else {
            group[key].push(item);
        }
    });


    return group;
}