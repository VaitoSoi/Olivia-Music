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
const command_1 = require("../lib/command");
const discord_js_1 = require("discord.js");
// const opt: { name: string, value: string }[] = [
//     { name: "Tự động", value: QueryType.AUTO },
//     { name: "Youtube", value: QueryType.YOUTUBE },
//     { name: "Youtube Playlist", value: QueryType.YOUTUBE_PLAYLIST },
//     { name: "Youtube Video", value: QueryType.YOUTUBE_VIDEO },
//     { name: "Spotify Album", value: QueryType.SPOTIFY_ALBUM },
//     { name: "Spotify Playlist", value: QueryType.SPOTIFY_PLAYLIST },
//     { name: "Spotify Song", value: QueryType.SPOTIFY_SONG },
//     { name: "Soundcloud", value: QueryType.SOUNDCLOUD },
//     { name: "Soundcloud Playlist", value: QueryType.SOUNDCLOUD_PLAYLIST },
//     { name: "Soundcloud Track", value: QueryType.SOUNDCLOUD_TRACK },
//     { name: "Apple Music Album", value: QueryType.APPLE_MUSIC_ALBUM },
//     { name: "Apple Music Playlist", value: QueryType.APPLE_MUSIC_PLAYLIST },
//     { name: "Apple Music Song", value: QueryType.APPLE_MUSIC_SONG },
//     { name: "Arbitary", value: QueryType.ARBITRARY },
//     { name: "Facebook", value: QueryType.FACEBOOK },
//     { name: "File", value: QueryType.FILE },
//     { name: "Revernation", value: QueryType.REVERBNATION },
//     { name: "Vimeo", value: QueryType.VIMEO },
//     { name: "Tự động tìm kiếm", value: QueryType.AUTO_SEARCH },
//     { name: "Tìm kiếm trên Youtube", value: QueryType.YOUTUBE_SEARCH },
//     { name: "Tìm kiếm trên Spotify", value: QueryType.SPOTIFY_SEARCH },
//     { name: "Tìm kiếm trên Apple Music", value: QueryType.APPLE_MUSIC_SEARCH },
//     { name: "Tìm kiếm trên SoundCloud", value: QueryType.SOUNDCLOUD_SEARCH },
// ]
exports.default = new command_1.CommandDataBuilder()
    .setData(new discord_js_1.SlashCommandBuilder()
    .setName("play")
    .setDescription("Phát một bài hát hoặc thêm vào hàng chờ")
    .addSubcommand(sub => sub
    .setName('url')
    .setDescription('Phát bài hát bằng URL')
    .addStringOption(opt => opt
    .setName("query")
    .setDescription("URL của bài hát")
    .setRequired(true))
    .addStringOption(opt => opt
    .setName('engine')
    .setDescription('Nguồn tìm kiếm')
    .addChoices({ name: "Tự động", value: discord_player_1.QueryType.AUTO }, { name: "Youtube", value: discord_player_1.QueryType.YOUTUBE }, { name: "Youtube Playlist", value: discord_player_1.QueryType.YOUTUBE_PLAYLIST }, { name: "Youtube Video", value: discord_player_1.QueryType.YOUTUBE_VIDEO }, { name: "Spotify Album", value: discord_player_1.QueryType.SPOTIFY_ALBUM }, { name: "Spotify Playlist", value: discord_player_1.QueryType.SPOTIFY_PLAYLIST }, { name: "Spotify Song", value: discord_player_1.QueryType.SPOTIFY_SONG }, { name: "Soundcloud", value: discord_player_1.QueryType.SOUNDCLOUD }, { name: "Soundcloud Playlist", value: discord_player_1.QueryType.SOUNDCLOUD_PLAYLIST }, { name: "Soundcloud Track", value: discord_player_1.QueryType.SOUNDCLOUD_TRACK }, { name: "Apple Music Album", value: discord_player_1.QueryType.APPLE_MUSIC_ALBUM }, { name: "Apple Music Playlist", value: discord_player_1.QueryType.APPLE_MUSIC_PLAYLIST }, { name: "Apple Music Song", value: discord_player_1.QueryType.APPLE_MUSIC_SONG }, { name: "Arbitary", value: discord_player_1.QueryType.ARBITRARY }, { name: "Facebook", value: discord_player_1.QueryType.FACEBOOK }, { name: "File", value: discord_player_1.QueryType.FILE }, { name: "Revernation", value: discord_player_1.QueryType.REVERBNATION }, { name: "Vimeo", value: discord_player_1.QueryType.VIMEO })))
    .addSubcommand(sub => sub
    .setName('search')
    .setDescription('Tìm bài hát bằng tên')
    .addStringOption(opt => opt
    .setName("query")
    .setDescription("Tên của bài hát")
    .setRequired(true))
    .addStringOption(opt => opt
    .setName('engine')
    .setDescription('Nguồn tìm kiếm')
    .addChoices({ name: "Tự động tìm kiếm", value: discord_player_1.QueryType.AUTO_SEARCH }, { name: "Tìm kiếm trên Youtube", value: discord_player_1.QueryType.YOUTUBE_SEARCH }, { name: "Tìm kiếm trên Spotify", value: discord_player_1.QueryType.SPOTIFY_SEARCH }, { name: "Tìm kiếm trên Apple Music", value: discord_player_1.QueryType.APPLE_MUSIC_SEARCH }, { name: "Tìm kiếm trên SoundCloud", value: discord_player_1.QueryType.SOUNDCLOUD_SEARCH }))))
    .setExecute((interaction, olivia) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    if (!interaction.guild)
        return;
    const userVC = (_b = (yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user)))) === null || _b === void 0 ? void 0 : _b.voice.channel;
    if (!userVC)
        return interaction.editReply({
            content: 'Bạn không trong Voice Channel :c'
        });
    const botVC = (_d = (yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.fetchMe()))) === null || _d === void 0 ? void 0 : _d.voice.channel;
    if (!!botVC && botVC.id != userVC.id)
        return interaction.editReply({
            content: 'Bạn không trong cùng Voice Channel với bot D:'
        });
    const queue = olivia.player.nodes.get(interaction.guild) || olivia.player.nodes.create(interaction.guild, { metadata: { message: undefined } });
    if (!botVC)
        yield queue.connect(userVC);
    const subcommand = interaction.options.getSubcommand();
    const query = interaction.options.getString('query', true);
    const engine = interaction.options.getString('engine') || "auto";
    const search = yield olivia.player.search(query, { searchEngine: engine, blockExtractors: [] });
    if (subcommand == "url") {
        queue.addTrack(search.playlist || search.tracks[0]);
        if (!queue.node.isPlaying() && !queue.node.isPaused())
            yield queue.node.play();
        interaction.editReply(`Đã thêm \`${((_e = search.playlist) === null || _e === void 0 ? void 0 : _e.title) || search.tracks[0].title}\` vào hàng chờ`);
    }
    else {
        const label = [
            '1️⃣',
            '2️⃣',
            '3️⃣',
            '4️⃣',
            '5️⃣',
        ];
        const msg = yield interaction.editReply({
            content: 'Vui lòng chọn 1 trong 5 bài dưới đây',
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId('song_selector')
                    .setPlaceholder('Search Results')
                    .setOptions(...search.tracks.slice(0, 5).map((track, index) => new discord_js_1.StringSelectMenuOptionBuilder()
                    .setDefault(false)
                    .setLabel(`${track.title}`)
                    .setDescription(`Author: ${track.author} | Duration: ${track.duration}`)
                    .setValue(index + '')
                    .setEmoji(label[index])))
                    .setMaxValues(1))
            ]
        });
        const collector = msg.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.StringSelect,
            time: 60 * 1000
        });
        collector.on('collect', (selectMenu) => __awaiter(void 0, void 0, void 0, function* () {
            if (selectMenu.customId != 'song_selector')
                return;
            if (!selectMenu.guild)
                return;
            const song = search.tracks[Number(selectMenu.component.options[0].value)];
            queue.addTrack(song);
            if (!queue.node.isPlaying() && !queue.node.isPaused())
                queue.node.play()
                    .catch((err) => olivia.logger.error('player', err));
            selectMenu.update({
                content: `Đã thêm \`${song.title}\` vào hàng chờ`,
                components: []
            })
                .catch((err) => olivia.logger.error('player', err));
        }));
        collector.on('end', () => void msg.edit({ components: [] }));
    }
}));
