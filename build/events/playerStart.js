"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_player_1 = require("discord-player");
const event_1 = require("../lib/event");
const discord_js_1 = require("discord.js");
exports.default = new event_1.EventBuilder()
    .setName(discord_player_1.GuildQueueEvent.playerStart)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    return (_a = queue.channel) === null || _a === void 0 ? void 0 : _a.send({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: `${queue.guild.name} - Now Playing`,
                iconURL: queue.guild.iconURL() || ''
            })
                .setDescription('**Now playing:**\n' +
                '```\n' +
                track.title +
                '```')
                .setColor('Random')
                .setThumbnail(track.thumbnail)
                .addFields({ name: `🤵‍♂️ Tác giả`, value: `${track.author}`, inline: true }, { name: '⌛ Thời lượng', value: `${track.duration}`, inline: true }, { name: '🎶 Nguồn', value: `${track.source.toUpperCase()}`, inline: true })
                .setTimestamp()
                .setFooter({
                text: `${(_b = olivia.client.user) === null || _b === void 0 ? void 0 : _b.tag}`,
                iconURL: ((_c = olivia.client.user) === null || _c === void 0 ? void 0 : _c.avatarURL()) || ''
            })
        ]
    });
}));
