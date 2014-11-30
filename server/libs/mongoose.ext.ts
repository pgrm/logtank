import M = require("mongoose");

export class CustomSchema<T> extends M.Schema {
    public methods: T;

    constructor(schema?: Object, options?: Object) {
        super(schema, options);
    }
}