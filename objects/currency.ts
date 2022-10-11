import { ValueError } from "../exceptions";
import { currencyFormatter } from "../utils";


class Currency {
    static readonly zero: Currency = new Currency(0);
    static readonly min: Currency = new Currency(1000);

    private value_: number = 0;

    constructor(value: number) {
        if (this.isLegal(value)) {
            this.value_ = value;
        }
    }

    set value(value: number) {
        if (this.isLegal(value)) {
            this.value_ = value;
        }
    }

    get value() {
        return this.value_;
    }


    isLegal(value: number) {
        return Number.isInteger(value);
    }

    add(other: Currency) {
        return Currency.of(this.value + other.value);
    }

    subtract(other: Currency) {
        return Currency.of(this.value - other.value);
    }

    multiply(a: number) {
        if (Number.isInteger(a)) {
            return Currency.of(this.value * a);
        } else {
            throw new ValueError("a must be an integer");
        }
    }

    divide(a: number) {
        return Currency.of(Math.round(this.value / a));
    }

    public toString(): string {
        return currencyFormatter(this.value);
    }

    compare(other: Currency): number {
        return this.value - other.value;
    }

    static of(value: number): Currency {
        return new Currency(value);
    }
}

export default Currency;