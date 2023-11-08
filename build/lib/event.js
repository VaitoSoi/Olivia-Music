"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBuilder = void 0;
class EventBuilder {
    constructor() {
        this.name = '';
        this.once = false;
        this.type = 'discord';
        this.execute = () => { };
    }
    setName(name) { this.name = name; return this; }
    setOnce(once) { this.once = once; return this; }
    setType(type) { this.type = type; return this; }
    setExecute(execute) { this.execute = execute; return this; }
}
exports.EventBuilder = EventBuilder;
