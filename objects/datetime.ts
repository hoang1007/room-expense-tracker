// import "intl/locale-data/jsonp/en";

class Month {
    private date: Date;

    constructor(month: number, year: number) {
        this.date = new Date(year, month - 1);
    }

    getYear() {
        return this.date.getFullYear();
    }

    setYear(year: number) {
        this.date.setFullYear(year);
    }

    getMonthStr(type?: "numeric" | "long" | "2-digit" | "short" | "narrow") {
        if (typeof type === "undefined") {
            type = "numeric";
        }

        return this.date.toLocaleString("en-US", { month: type });
    }

    getMonth() {
        return this.date.getMonth() + 1;
    }

    setMonth(month: number) {
        this.date.setMonth(month + 1);
    }

    equal(other: Month) {
        return this.getMonth() == other.getMonth() && this.getYear() == other.getYear();
    }

    toLocaleString() {
        // return this.date.toLocaleString("en-US", { month: "short", year: "numeric" });
        return Month.toLocaleString(this.date);
    }

    static toLocaleString(date: Date) {
        return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    }

    copy({ month, year }: { month?: number, year?: number }) {
        if (typeof month === "undefined") {
            month = this.getMonth();
        }

        if (typeof year === "undefined") {
            year = this.getYear();
        }

        return new Month(month, year);
    }

    public static fromDate = ((date: Date) => {
        return new Month(date.getMonth() + 1, date.getFullYear())
    });

    public static readonly now: Month = (() => {
        let now = new Date();

        return Month.fromDate(now);
    })();
};

export { Month };