"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Olivia = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const node_fs_1 = __importDefault(require("node:fs"));
const ascii_table3_1 = __importDefault(require("ascii-table3"));
const node_path_1 = __importDefault(require("node:path"));
const Player = __importStar(require("discord-player"));
const command_1 = require("./command");
const logger_1 = require("./logger");
const expres_1 = require("./expres");
class Olivia {
    constructor(env) {
        this.env = env;
        this.commands = {
            collection: new discord_js_1.default.Collection(),
            jsonArray: []
        };
        this.logger = new logger_1.Logger('./debug.log');
        this.client = new discord_js_1.default.Client({
            intents: [
                discord_js_1.default.GatewayIntentBits.Guilds,
                discord_js_1.default.GatewayIntentBits.GuildVoiceStates
            ],
            allowedMentions: {
                repliedUser: true
            }
        });
        this.player = new Player.Player(this.client);
        this.express = new expres_1.OliviaExpress(this);
        this.logger.debug('global', 'Initialized client');
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleEvent(node_path_1.default.join(__dirname, '..', 'events'));
            yield this.handleCommand(node_path_1.default.join(__dirname, '..', 'commands'));
            yield this.player.extractors.loadDefault();
            this.express.start(8000);
            this.client.on(discord_js_1.default.Events.ClientReady, (client) => {
                this.logger.debug('discord', `Client ${client.user.tag} (${client.user.id}) is ready!`);
                this.registerCommand(client);
            });
            this.client.on(discord_js_1.default.Events.ShardReady, (shard) => this.logger.debug('discord', `Shard ${shard} is online!`));
            this.client.on(discord_js_1.default.Events.Warn, (warn) => this.logger.warn('discord', warn));
            this.client.on(discord_js_1.default.Events.Error, (error) => this.logger.error('discord', error));
            this.client.on(discord_js_1.default.Events.ShardError, (error) => this.logger.error('discord', error));
            this.player.events.on('error', (queue, error) => this.logger.error('player', `Occur error at guild ${queue.guild.name}: ${error}`));
            this.client.login(this.env.discord.token)
                .then((token) => this.logger.debug('discord', `Logined with token: ${token}`))
                .catch((error) => this.logger.error('discord', error));
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.destroy();
            yield this.player.destroy();
        });
    }
    handleEvent(path) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const files = node_fs_1.default.readdirSync(path).filter((file) => this.pathUtil(node_path_1.default.join(path, file)));
            let listend = [];
            for (let file of files) {
                const event = (yield Promise.resolve(`${node_path_1.default.join(path, file)}`).then(s => __importStar(require(s)))).default;
                if (!event)
                    continue;
                if (event.type == 'discord')
                    if (event.once)
                        this.client.once(event.name, (...args) => event.execute(this, ...args));
                    else
                        this.client.on(event.name, (...args) => event.execute(this, ...args));
                else if (event.type == 'player')
                    if (event.once)
                        this.player.events.once(event.name, (...args) => event.execute(this, ...args));
                    else
                        this.player.events.on(event.name, (...args) => event.execute(this, ...args));
                void listend.push([file, event.name, (_a = event.type) === null || _a === void 0 ? void 0 : _a.toUpperCase()]);
            }
            this.logger.debug('global', `Listened to ${listend.length} event(s)`, { mode: null });
            this.logger.debug('global', new ascii_table3_1.default.AsciiTable3('Olivia Events Listener')
                .setHeading('File', 'Event Name', 'Listener')
                .addRowMatrix(listend)
                .toString(), { mode: ['file'] });
        });
    }
    handleCommand(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = node_fs_1.default.readdirSync(path).filter((file) => this.pathUtil(node_path_1.default.join(path, file)));
            let handled = [];
            for (let file of files) {
                const command = (yield Promise.resolve(`${node_path_1.default.join(path, file)}`).then(s => __importStar(require(s)))).default;
                if (!command)
                    continue;
                const name = command instanceof command_1.CommandBuilder ? command.name : command.data.name;
                this.commands.collection.set(name, command);
                this.commands.jsonArray.push(command instanceof command_1.CommandBuilder ? command.toJSON() : command.data.toJSON());
                handled.push([file, name]);
            }
            this.logger.debug('global', `Handled ${handled.length} command(s)`, { mode: null });
            this.logger.debug('global', new ascii_table3_1.default.AsciiTable3('Olivia Commands Handler')
                .setHeading('File', 'Command Name')
                .addRowMatrix(handled)
                .toString(), { mode: ['file'] });
        });
    }
    registerCommand(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new discord_js_1.default.REST();
            rest.setToken(this.env.discord.token);
            const callback = yield rest.put(discord_js_1.default.Routes.applicationCommands(client.user.id), { body: this.commands.jsonArray });
            return this.logger.debug('discord', `Registered ${callback.length}/${this.commands.collection.size} slash command(s)`);
        });
    }
    pathUtil(path) {
        return node_fs_1.default.lstatSync(path).isFile() && path.endsWith('.js') || path.endsWith('.ts');
    }
}
exports.Olivia = Olivia;
