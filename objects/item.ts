import Currency from "./currency";


export enum Source {
    USER, DATABASE
}

class Item {
    name: string;
    price: Currency;
    buyDate: Date;
    readonly source: Source;

    constructor(name: string, price: Currency | number, source: Source, buyDate?: Date) {
        this.name = name;

        if (typeof price === 'number') {
            this.price = new Currency(price);
        } else {
            this.price = price;
        }

        if (typeof buyDate !== 'undefined') {
            this.buyDate = buyDate;
        } else {
            this.buyDate = new Date();
        }

        this.source = source;
    }
}

export default Item;