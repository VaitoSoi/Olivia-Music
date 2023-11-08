"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_player_1 = require("discord-player");
const event_1 = require("../lib/event");
exports.default = new event_1.EventBuilder()
    .setName(discord_player_1.GuildQueueEvent.disconnect)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue) => { var _a; return (_a = queue.channel) === null || _a === void 0 ? void 0 : _a.send(`🔈 Đã ngắt kết nối với <#${queue.channel.id}>`); });
