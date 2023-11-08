"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
class ENV {
    constructor(env) {
        this.discord = {
            token: ''
        };
        !!env.discord.token ? this.discord.token = env.discord.token : undefined;
    }
}
exports.ENV = ENV;
