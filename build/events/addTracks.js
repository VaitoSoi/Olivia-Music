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
    .setName(discord_player_1.GuildQueueEvent.audioTracksAdd)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return (_a = queue.channel) === null || _a === void 0 ? void 0 : _a.send({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: `${queue.guild.name} - Playlist Add`,
                iconURL: queue.guild.iconURL() || undefined
            })
                .setDescription('**Đã thêm một playlist:**\n' +
                '```\n' +
                ((_b = track[0].playlist) === null || _b === void 0 ? void 0 : _b.title) +
                '```')
                .setColor('Random')
                .setThumbnail(((_c = track[0].playlist) === null || _c === void 0 ? void 0 : _c.thumbnail) || null)
                .addFields({ name: `🤵‍♂️ Tác giả`, value: `${(_d = track[0].playlist) === null || _d === void 0 ? void 0 : _d.author.name}`, inline: true }, { name: '⌛ Số bài hát', value: `${(_e = track[0].playlist) === null || _e === void 0 ? void 0 : _e.tracks.length}`, inline: true }, { name: '🎶 Nguồn', value: `${(_f = track[0].playlist) === null || _f === void 0 ? void 0 : _f.source.toUpperCase()}`, inline: true })
                .setTimestamp()
                .setFooter({
                text: `${(_g = olivia.client.user) === null || _g === void 0 ? void 0 : _g.tag}`,
                iconURL: ((_h = olivia.client.user) === null || _h === void 0 ? void 0 : _h.avatarURL()) || ''
            })
        ]
    });
}));
