"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDataBuilder = exports.CommandBuilder = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
class CommandBuilder extends discord_js_1.default.SlashCommandBuilder {
    constructor() {
        super();
        this.execute = () => { };
        this.autocomplete = () => { };
        this.setDMPermission(false);
    }
    setExecute(execute) {
        this.execute = execute;
        return this;
    }
    setAutocomplete(autocomplete) {
        this.autocomplete = autocomplete;
        return this;
    }
}
exports.CommandBuilder = CommandBuilder;
class CommandDataBuilder {
    constructor() {
        this.name = '';
        this.data = new discord_js_1.default.SlashCommandBuilder();
        this.execute = () => { };
        this.autocomplete = () => { };
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setData(data) {
        this.data = data;
        return this;
    }
    setExecute(execute) {
        this.execute = execute;
        return this;
    }
    setAutocomplete(autocomplete) {
        this.autocomplete = autocomplete;
        return this;
    }
}
exports.CommandDataBuilder = CommandDataBuilder;
