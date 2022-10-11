export class ValueError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class TypeError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}