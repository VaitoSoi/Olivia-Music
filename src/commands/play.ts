import { QueryType, QueueRepeatMode, SearchQueryType } from "discord-player";
import { CommandBuilder, CommandDataBuilder } from "../lib/command";
import { ActionRowBuilder, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

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

export default new CommandDataBuilder()
    .setData(
        new SlashCommandBuilder()
            .setName("play")
            .setDescription("Phát một bài hát hoặc thêm vào hàng chờ")
            .addSubcommand(sub => sub
                .setName('url')
                .setDescription('Phát bài hát bằng URL')
                .addStringOption(opt => opt
                    .setName("query")
                    .setDescription("URL của bài hát")
                    .setRequired(true)
                )
                .addStringOption(opt => opt
                    .setName('engine')
                    .setDescription('Nguồn tìm kiếm')
                    .addChoices(
                        { name: "Tự động", value: QueryType.AUTO },
                        { name: "Youtube", value: QueryType.YOUTUBE },
                        { name: "Youtube Playlist", value: QueryType.YOUTUBE_PLAYLIST },
                        { name: "Youtube Video", value: QueryType.YOUTUBE_VIDEO },
                        { name: "Spotify Album", value: QueryType.SPOTIFY_ALBUM },
                        { name: "Spotify Playlist", value: QueryType.SPOTIFY_PLAYLIST },
                        { name: "Spotify Song", value: QueryType.SPOTIFY_SONG },
                        { name: "Soundcloud", value: QueryType.SOUNDCLOUD },
                        { name: "Soundcloud Playlist", value: QueryType.SOUNDCLOUD_PLAYLIST },
                        { name: "Soundcloud Track", value: QueryType.SOUNDCLOUD_TRACK },
                        { name: "Apple Music Album", value: QueryType.APPLE_MUSIC_ALBUM },
                        { name: "Apple Music Playlist", value: QueryType.APPLE_MUSIC_PLAYLIST },
                        { name: "Apple Music Song", value: QueryType.APPLE_MUSIC_SONG },
                        { name: "Arbitary", value: QueryType.ARBITRARY },
                        { name: "Facebook", value: QueryType.FACEBOOK },
                        { name: "File", value: QueryType.FILE },
                        { name: "Revernation", value: QueryType.REVERBNATION },
                        { name: "Vimeo", value: QueryType.VIMEO },
                    )
                )
            )
            .addSubcommand(sub => sub
                .setName('search')
                .setDescription('Tìm bài hát bằng tên')
                .addStringOption(opt => opt
                    .setName("query")
                    .setDescription("Tên của bài hát")
                    .setRequired(true)
                )
                .addStringOption(opt => opt
                    .setName('engine')
                    .setDescription('Nguồn tìm kiếm')
                    .addChoices(
                        { name: "Tự động tìm kiếm", value: QueryType.AUTO_SEARCH },
                        { name: "Tìm kiếm trên Youtube", value: QueryType.YOUTUBE_SEARCH },
                        { name: "Tìm kiếm trên Spotify", value: QueryType.SPOTIFY_SEARCH },
                        { name: "Tìm kiếm trên Apple Music", value: QueryType.APPLE_MUSIC_SEARCH },
                        { name: "Tìm kiếm trên SoundCloud", value: QueryType.SOUNDCLOUD_SEARCH },
                    )
                )
            )
    )
    .setExecute(async (interaction, olivia) => {
        if (!interaction.guild) return
        const userVC = (await interaction.guild?.members.fetch(interaction.user))?.voice.channel
        if (!userVC) return interaction.editReply({
            content: 'Bạn không trong Voice Channel :c'
        })
        const botVC = (await interaction.guild?.members.fetchMe())?.voice.channel
        let connect = false
        if (!!botVC && botVC.id != userVC.id) return interaction.editReply({
            content: 'Bạn không trong cùng Voice Channel với bot D:'
        })
        if (olivia.player.nodes.get(interaction.guild) == null) {
            if (!!botVC)
                await (await interaction.guild?.members.fetchMe())?.voice.disconnect()
            connect = true
        }

        let queue = olivia.player.nodes.get(interaction.guild) || olivia.player.nodes.create(interaction.guild);
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
        if (connect == true)
            await queue.connect(userVC)

        const subcommand = interaction.options.getSubcommand()
        const query = interaction.options.getString('query', true)
        const engine = interaction.options.getString('engine') as SearchQueryType || "auto"
        const search = await olivia.player.search(query, { searchEngine: engine, blockExtractors: [] })

        if (subcommand == "url") {
            queue.addTrack(search.playlist || search.tracks[0])
            if (!queue.node.isPlaying() && !queue.node.isPaused()) await queue.node.play()
            interaction.editReply(`Đã thêm \`${search.playlist?.title || search.tracks[0].title}\` vào hàng chờ`)
        } else {
            const label = [
                '1️⃣',
                '2️⃣',
                '3️⃣',
                '4️⃣',
                '5️⃣',
            ];
            const msg = await interaction.editReply({
                content: 'Vui lòng chọn 1 trong 5 bài dưới đây',
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('song_selector')
                                .setPlaceholder('Search Results')
                                .setOptions(
                                    ...search.tracks.slice(0, 5).map((track, index) =>
                                        new StringSelectMenuOptionBuilder()
                                            .setDefault(false)
                                            .setLabel(`${track.title}`)
                                            .setDescription((() => { 
                                                let author = track.author
                                                author = author.length >= 15 ? author.substring(0, 15) + '...': author
                                                return `Author: ${author} | Duration: ${track.duration}`
                                            })())
                                            .setValue(index + '')
                                            .setEmoji(label[index])
                                    )
                                )
                                .setMaxValues(1)
                        )
                ]
            })
            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 60 * 1000
            })
            collector.on('collect', async (selectMenu) => {
                if (selectMenu.customId != 'song_selector') return
                if (!selectMenu.guild) return
                const song = search.tracks[Number(selectMenu.values[0])]
                queue.addTrack(song)
                if (!queue.node.isPlaying() && !queue.node.isPaused()) queue.node.play()
                    .catch((err) => olivia.logger.error('player', err))
                selectMenu.update({
                    content: `Đã thêm \`${song.title}\` vào hàng chờ`,
                    components: []
                })
                    .catch((err) => olivia.logger.error('player', err))
            })
            collector.on('end', () => void msg.edit({ components: [] }))
        }
    })