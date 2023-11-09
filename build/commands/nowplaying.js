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
const command_1 = require("../lib/command");
const discord_js_1 = require("discord.js");
exports.default = new command_1.CommandBuilder()
    .setName("nowplaying")
    .setDescription("Thông tin bài hát hiện tại")
    .setExecute((interaction, olivia) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!interaction.guild)
        return;
    const queue = olivia.player.nodes.get(interaction.guild);
    if (!queue)
        return interaction.editReply('Hàng chờ đang trống :c');
    const track = queue.currentTrack;
    if (!track)
        return;
    interaction.editReply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: `${queue.guild.name} - Queue`,
                iconURL: queue.guild.iconURL() || ''
            })
                .setDescription('**Đã thêm một bài hát:**\n' +
                '```\n' +
                track.title +
                '```')
                .setColor('Random')
                .setThumbnail(track.thumbnail)
                .addFields({ name: `🤵‍♂️ Tác giả`, value: `${track.author}`, inline: true }, { name: '⌛ Thời lượng', value: `${track.duration}`, inline: true }, { name: '🎶 Nguồn', value: `${track.source.toUpperCase()}`, inline: true })
                .setTimestamp()
                .setFooter({
                text: `${(_a = olivia.client.user) === null || _a === void 0 ? void 0 : _a.tag}`,
                iconURL: ((_b = olivia.client.user) === null || _b === void 0 ? void 0 : _b.avatarURL()) || ''
            })
        ]
    });
}));
